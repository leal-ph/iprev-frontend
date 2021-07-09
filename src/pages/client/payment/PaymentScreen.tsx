import React, { memo, useEffect, useState, useCallback } from 'react'

import { Radio, Card, message, Select } from 'antd'

import ClientLayout from '~/assets/components/GlobalLayout'

import { PaymentItem, ResponseStatus, Payment, PaymentStatus, PaymentPayer } from '~/types'
import { useStores } from '~/hooks/use-stores'
import { observer } from 'mobx-react-lite'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import ClientCreditCard from '~/assets/components/ClientCreditCard'
import ClientBankSlip from '~/assets/components/ClientBankSlip'
import { MSG_PAYMENT_ERROR, MSG_PAYMENT_SUCCESS } from '~/utils/messages'

const buttonStyle: React.CSSProperties = {
  border: '1px solid #000F34',
}

const PaymentScreen = observer(() => {
  const { paymentStore, authStore, clientStore } = useStores()

  const history = useHistory()

  // const [form] = Form.useForm()
  const [activeTab, setActiveTab] = useState(0)
  const [selectedPayment, setSelectedPayment] = useState<Payment | undefined>(undefined)

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  const onBankSlip = useCallback(
    async (id: string, email: string, itens: PaymentItem[], payer: PaymentPayer) => {
      const response = await paymentStore.generateBankSlip(id, email, itens, payer)

      if (response?.url) {
        window.open(response.url)
        if (clientStore.currentUser) {
          paymentStore.loadPlaceholders(clientStore.currentUser._id)
        }
        return
      }

      message.error(MSG_PAYMENT_ERROR)
    },
    [paymentStore, clientStore.currentUser],
  )

  const onCreditCard = useCallback(
    async (
      id: string,
      email: string,
      itens: PaymentItem[],
      payer: PaymentPayer,
      token: string,
      months: string,
    ) => {
      const response = await paymentStore.generateCC(id, email, itens, payer, token, months)

      if (response === ResponseStatus.SUCCESS) {
        message.success(MSG_PAYMENT_SUCCESS)
        if (clientStore.currentUser) {
          paymentStore.loadPlaceholders(clientStore.currentUser._id)
        }
        return
      }

      message.error(MSG_PAYMENT_ERROR)
    },
    [paymentStore, clientStore.currentUser],
  )

  useEffect(() => {
    if (clientStore.currentUser) {
      paymentStore.loadPlaceholders(clientStore.currentUser._id)
    }
  }, [clientStore.currentUser, paymentStore])

  useEffect(() => {
    if (authStore.loggedUser) {
      clientStore.loadClient(authStore.loggedUser._id)
    }
  }, [authStore.loggedUser, clientStore])

  const tabs = useCallback(
    (activeTab) => {
      const values = [
        <ClientCreditCard
          client={clientStore.currentUser!}
          payment={selectedPayment!}
          loading={paymentStore.creditCardPaymentLoading}
          onGenerate={onCreditCard}
          key="1"
        />,
        <ClientBankSlip
          client={clientStore.currentUser!}
          payment={selectedPayment!}
          loading={paymentStore.bankSlipPaymentLoading}
          onGenerate={onBankSlip}
          key="2"
        />,
      ]
      return values[activeTab]
    },
    [
      onCreditCard,
      onBankSlip,
      paymentStore.creditCardPaymentLoading,
      paymentStore.bankSlipPaymentLoading,
      selectedPayment,
      clientStore.currentUser,
    ],
  )

  return (
    <ClientLayout
      title="PAGAMENTO DE HONORÁRIOS"
      onBack={() => history.push('/client/menu')}
      content={
        paymentStore.placeholders.length === 0 ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Card
              className="custom-card"
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '5vh',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <span
                  style={{
                    fontWeight: 'bold',
                    marginBottom: '10px',
                    width: isPortrait ? '90vw' : '50vw',
                    textAlign: 'center',
                  }}
                >
                  Não existem pagamentos pendentes.
                </span>
                <FontAwesomeIcon icon={faCheckCircle} size="5x" style={{ color: 'green' }} />
              </div>
            </Card>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Select
              className="custom-select"
              placeholder="Selecione o pagamento"
              onChange={(value) =>
                setSelectedPayment(
                  paymentStore.placeholders.find((p) => p._id === value.toString()),
                )
              }
              style={{
                width: isPortrait ? '90vw' : '30vw',
                marginBottom: '15px',
                marginTop: '5px',
              }}
            >
              {paymentStore.placeholders.map((p) => (
                <Select.Option value={p._id} key={p._id}>
                  {p.status === PaymentStatus.PLACEHOLDER
                    ? `${p.charge_identification} (Novo)`
                    : `${p.charge_identification} (Pendente)`}
                </Select.Option>
              ))}
            </Select>
            {selectedPayment && (
              <div style={{ width: isPortrait ? '90vw' : '30vw' }}>
                <Radio.Group
                  defaultValue="1"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '10px',
                  }}
                >
                  <Radio.Button value="1" style={buttonStyle} onClick={() => setActiveTab(0)}>
                    CARTÃO
                  </Radio.Button>
                  <Radio.Button value="2" style={buttonStyle} onClick={() => setActiveTab(1)}>
                    BOLETO
                  </Radio.Button>
                </Radio.Group>
                {tabs(activeTab)}
              </div>
            )}
          </div>
        )
      }
    />
  )
})

export default memo(PaymentScreen)
