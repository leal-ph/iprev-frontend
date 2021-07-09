/* eslint-disable indent */
import React, { memo, useState, useCallback, useEffect } from 'react'
import {
  Card,
  List,
  Form,
  Input,
  Button,
  Select,
  message,
  DatePicker,
  Tag,
  Modal,
  Radio,
  Tooltip,
  Popconfirm,
} from 'antd'
import { observer } from 'mobx-react-lite'
import { Payment, PaymentPayer, PaymentStatus, PaymentItem, ResponseStatus } from '~/types'
import { columnDisplayStart } from '~/utils/display'
import { useForm } from 'antd/lib/form/Form'
import { useStores } from '~/hooks/use-stores'
import { MSG_PAYMENT_SUCCESS, MSG_PAYMENT_ERROR } from '~/utils/messages'
import NumberFormat from 'react-number-format'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoneyBill, faTrash } from '@fortawesome/free-solid-svg-icons'
import ClientBankSlip from '~/assets/components/ClientBankSlip'
import ClientCreditCard from '~/assets/components/ClientCreditCard'
import { useMediaQuery } from 'react-responsive'

interface Props {
  divCardStyle: React.CSSProperties
  cardStyle: React.CSSProperties
}

const buttonStyle: React.CSSProperties = {
  border: '1px solid #000F34',
}

const ClientPayment = observer(({ divCardStyle, cardStyle }: Props) => {
  const [form] = useForm()

  const selectNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  const { adminStore, paymentStore } = useStores()

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  const [totalValue, setTotalValue] = useState(0)

  const [payment, setPayment] = useState<Payment | undefined>(undefined)
  const [activeCC, setActiveCC] = useState(true)

  const onBankSlip = useCallback(
    async (id: string, email: string, itens: PaymentItem[], payer: PaymentPayer) => {
      const response = await paymentStore.generateBankSlip(id, email, itens, payer)

      if (response?.url) {
        window.open(response.url)
        if (adminStore.selectedClient) {
          adminStore.loadClientPayments(adminStore.selectedClient._id)
        }
        return
      }

      message.error(MSG_PAYMENT_ERROR)
    },
    [paymentStore, adminStore],
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
        if (adminStore.selectedClient) {
          adminStore.loadClientPayments(adminStore.selectedClient._id)
        }
        return
      }

      message.error(MSG_PAYMENT_ERROR)
    },
    [paymentStore, adminStore],
  )

  const generatePayment = useCallback(() => {
    form.validateFields().then(async () => {
      const { type, recurrenceCounter, expirydate } = form.getFieldsValue()

      const payment = {
        charge_identification: type,
        max_parcels: recurrenceCounter,
        item: {
          description: type,
          quantity: 1,
          price_cents: totalValue,
        },
        expiry_date: new Date(expirydate.startOf('day')),
        type: undefined,
        status: PaymentStatus.PLACEHOLDER,
      }

      if (adminStore.selectedClient) {
        if (await paymentStore.generatePlaceHolder(adminStore.selectedClient?._id, payment)) {
          message.success(MSG_PAYMENT_SUCCESS)
          paymentStore.loadClientPayments(adminStore.selectedClient._id)
        } else {
          message.error(MSG_PAYMENT_ERROR)
        }
      }
    })
  }, [adminStore.selectedClient, paymentStore, form, totalValue])

  const excludePayment = useCallback(
    async (payment: Payment) => {
      const response = await adminStore.deletePayment(payment._id, adminStore.selectedClient!._id)
      if (response === ResponseStatus.SUCCESS) {
        message.success('Pagamento removido com sucesso!')
        paymentStore.loadClientPayments(adminStore.selectedClient!._id)
      } else {
        message.success('Erro na remoção do pagamento!')
        return
      }
    },
    [adminStore, paymentStore],
  )

  const convertPaymentStatus = useCallback((status: string, expiry_date: Date, type: string) => {
    const now = new Date()

    if (status === 'paid') {
      return <Tag color="green">Pago</Tag>
    } else if (
      new Date(expiry_date) < new Date(now) &&
      (status === 'pending' || status === 'placeholder') &&
      type !== 'HONORÁRIOS'
    ) {
      return <Tag color="red">Expirado</Tag>
    } else if (status === 'pending') {
      return <Tag color="gold">Pendente</Tag>
    } else if (status === 'placeholder') {
      return <Tag color="blue">Novo</Tag>
    }
  }, [])

  const renderPayment = useCallback(
    (toRender: Payment) => {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div style={{ ...columnDisplayStart, marginLeft: '10px' }}>
            <span>
              <b>Status:</b>{' '}
              {convertPaymentStatus(
                toRender.status,
                toRender.expiry_date!,
                toRender.charge_identification!,
              )}
            </span>
            <span>
              <b>Tipo:</b> {toRender.charge_identification}
            </span>
            <span>
              <b>Valor:</b> R$ {(toRender.item.price_cents / 100).toLocaleString('pt-BR')}
            </span>
            <span>
              <b>Data de Criação:</b>{' '}
              {moment(toRender.createdAt).utcOffset('-0300').format('DD/MM/YYYY - HH:mm')}
            </span>
            {toRender.charge_identification !== 'HONORÁRIOS' && (
              <span>
                <b>Data limite:</b>{' '}
                {moment(toRender.expiry_date).utcOffset('-0300').format('DD/MM/YYYY')}
              </span>
            )}
          </div>
          {!isPortrait && (
            <div style={{ marginRight: '10px' }}>
              {toRender.status !== PaymentStatus.PAID && (
                <Tooltip title="Pagar">
                  <FontAwesomeIcon
                    icon={faMoneyBill}
                    onClick={() => setPayment(toRender)}
                    style={{ cursor: 'pointer' }}
                    size="2x"
                  />
                </Tooltip>
              )}
              <Tooltip title="Deletar Pagamento">
                <Popconfirm
                  title="Deseja realmente deletar o pagamento?"
                  onConfirm={() => excludePayment(toRender)}
                  okButtonProps={{ danger: true }}
                  okText="Excluir"
                  cancelText="Não"
                >
                  <FontAwesomeIcon
                    icon={faTrash}
                    style={{ cursor: 'pointer', marginLeft: '10px' }}
                    size="2x"
                  />
                </Popconfirm>
              </Tooltip>
            </div>
          )}
        </div>
      )
    },
    [convertPaymentStatus, excludePayment, isPortrait],
  )

  const actionsButtons = useCallback(() => {
    return [
      <Button
        onClick={generatePayment}
        key="generate"
        type="primary"
        style={{
          width: '20vw',
        }}
      >
        GERAR
      </Button>,
    ]
  }, [generatePayment])

  useEffect(() => {
    if (adminStore.selectedClient) {
      paymentStore.loadClientPayments(adminStore.selectedClient._id)
    }
  }, [adminStore.selectedClient, paymentStore])

  return (
    <div>
      <div style={divCardStyle}>
        <Card
          className="custom-card"
          title={<div className="custom-list-title">Pagamentos</div>}
          style={cardStyle}
        >
          <List locale={{ emptyText: 'SEM DADOS' }}>
            {paymentStore.payments.length > 0 &&
              paymentStore.payments.map((payment) => (
                <List.Item className="custom-list-item" key={payment._id}>
                  {renderPayment(payment)}
                </List.Item>
              ))}
          </List>
        </Card>
        <Card
          className="custom-card"
          title={<div className="custom-list-title">Gerar Cobrança</div>}
          style={{
            ...cardStyle,
            marginLeft: isPortrait ? 0 : '5px',
            marginTop: isPortrait ? '5px' : 0,
            marginBottom: isPortrait ? '10px' : 0,
          }}
          actions={actionsButtons()}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="type"
              key="type"
              label="Descrição da cobrança:"
              rules={[{ required: true }]}
            >
              <Input allowClear className="custom-input" />
            </Form.Item>
            <div style={{ display: 'flex', flexDirection: isPortrait ? 'column' : 'row' }}>
              <Form.Item
                name="value"
                key="value"
                label="Valor da cobrança:"
                rules={[{ required: true }]}
                style={{ width: isPortrait ? '100%' : '50%', marginRight: isPortrait ? 0 : '10px' }}
              >
                <NumberFormat
                  style={{ boxShadow: '0px 0px 3px #33333380' }}
                  className="ant-input"
                  thousandSeparator={'.'}
                  decimalSeparator={','}
                  prefix={'R$ '}
                  placeholder={'R$ 0,00'}
                  onValueChange={(values) => {
                    const { value } = values
                    setTotalValue(parseFloat(value) * 100)
                  }}
                />
              </Form.Item>
              <Form.Item
                name="expirydate"
                key="expirydate"
                label="Data limite para pagamento:"
                rules={[{ required: true }]}
                style={{ width: isPortrait ? '100%' : '50%' }}
              >
                <DatePicker
                  style={{ boxShadow: '0px 0px 3px #33333380', width: '100%' }}
                  placeholder="Selecione a data"
                  format="DD/MM/YYYY"
                ></DatePicker>
              </Form.Item>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Form.Item
                name="recurrenceCounter"
                key="recurrenceCounter"
                label="Número máximo de parcelas:"
                style={{ width: '100%' }}
                rules={[{ required: true }]}
              >
                <Select className="custom-select">
                  {selectNumbers.map((number) => (
                    <Select.Option key={number} value={number}>{`${number}x`}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            {/* <span>
              <b>VALOR TOTAL:</b> {formattedValue}
            </span> */}
          </Form>
        </Card>
      </div>

      {payment && (
        <Modal
          visible={!!payment}
          onCancel={() => setPayment(undefined)}
          okButtonProps={{ style: { display: 'none' } }}
          cancelButtonProps={{ style: { display: 'none' } }}
          destroyOnClose
          width="35vw"
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Radio.Group
              defaultValue="1"
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '10px',
              }}
            >
              <Radio.Button value="1" style={buttonStyle} onClick={() => setActiveCC(true)}>
                CARTÃO
              </Radio.Button>
              <Radio.Button value="2" style={buttonStyle} onClick={() => setActiveCC(false)}>
                BOLETO
              </Radio.Button>
            </Radio.Group>
            {activeCC ? (
              <ClientCreditCard
                client={adminStore.selectedClient!}
                payment={payment}
                loading={paymentStore.creditCardPaymentLoading}
                onGenerate={onCreditCard}
              />
            ) : (
              <ClientBankSlip
                client={adminStore.selectedClient!}
                payment={payment}
                loading={paymentStore.bankSlipPaymentLoading}
                onGenerate={onBankSlip}
              />
            )}
          </div>
        </Modal>
      )}
    </div>
  )
})

export default memo(ClientPayment)
