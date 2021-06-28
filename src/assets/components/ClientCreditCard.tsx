import { Button, Card, Input, Form, Select } from 'antd'
import React, { memo, useCallback } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useStores } from '~/hooks/use-stores'
import { Client, Payment, PaymentPayer, PaymentItem } from '~/types'
import { formatCurrency } from '~/utils/payment-utils'
import NumberFormat from 'react-number-format'

const selectNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

interface Props {
  client: Client
  payment: Payment
  loading: boolean
  onGenerate: (
    id: string,
    email: string,
    itens: PaymentItem[],
    payer: PaymentPayer,
    token: string,
    months: string,
  ) => void
}

const ClientCreditCard = ({ client, payment, loading, onGenerate }: Props) => {
  const { paymentStore } = useStores()

  const [form] = Form.useForm()

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  const creditCardHandle = useCallback(async () => {
    const { name, number, cvv, month, year, months } = form.getFieldsValue()

    const token = await paymentStore.generateCCToken(
      number.toString(),
      cvv.toString(),
      name.split(' ')[0].toString(),
      name.split(' ').pop()!.toString(),
      month.toString(),
      year.toString(),
    )

    if (token) {
      const payer = {
        cpf_cnpj: client.cpf,
        name: client.fullname || client.name,
        email: client.email,
        address: {
          zip_code: client.zipcode || '00000-000',
          number: client.telephone || '61 99999-9999',
        },
      }

      onGenerate(payment._id!, client.email, [payment.item], payer, token, months)
    }
  }, [
    form,
    paymentStore,
    client.cpf,
    client.email,
    client.fullname,
    client.name,
    client.telephone,
    client.zipcode,
    onGenerate,
    payment._id,
    payment.item,
  ])

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '2vh',
      }}
    >
      <Card
        className="custom-card"
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: isPortrait ? '80vw' : '30vw' }}>
          <div
            style={{
              marginBottom: '20px',
            }}
          >
            <Input
              value={`Valor Total: ${formatCurrency(payment.item.price_cents / 100)}`}
              readOnly
            />
          </div>
          <Form form={form} layout="vertical">
            <Form.Item
              label="Nome do Titular:"
              name="name"
              rules={[{ required: true, message: 'Nome do Titular é obrigatório!' }]}
            >
              <Input className="custom-input" style={{ width: '100%' }}></Input>
            </Form.Item>
            <div
              style={{
                display: 'flex',
                flexDirection: isPortrait ? 'column' : 'row',
                justifyContent: 'space-between',
              }}
            >
              <Form.Item
                label="Número do Cartão:"
                name="number"
                rules={[{ required: true, message: 'Número do Cartão é obrigatório!' }]}
              >
                <Input
                  style={{ width: isPortrait ? '100%' : '14vw' }}
                  className="custom-input"
                ></Input>
              </Form.Item>
              <Form.Item
                label="CVV:"
                name="cvv"
                rules={[{ required: true, message: 'CVV é obrigatório!' }]}
              >
                <Input
                  style={{ width: isPortrait ? '100%' : '14vw' }}
                  className="custom-input"
                ></Input>
              </Form.Item>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: isPortrait ? 'column' : 'row',
                justifyContent: 'space-between',
              }}
            >
              <Form.Item
                label="Mês de Validade:"
                name="month"
                rules={[{ required: true, message: 'Mês de Validade é obrigatório!' }]}
              >
                <NumberFormat
                  style={{
                    width: isPortrait ? '100%' : '14vw',
                    boxShadow: '0px 0px 3px #33333380',
                  }}
                  className="ant-input"
                  format="##"
                />
              </Form.Item>
              <Form.Item
                label="Ano de Validade:"
                name="year"
                rules={[{ required: true, message: 'Ano de Validade é obrigatório!' }]}
              >
                <NumberFormat
                  style={{
                    width: isPortrait ? '100%' : '14vw',
                    boxShadow: '0px 0px 3px #33333380',
                  }}
                  className="ant-input"
                  format="####"
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label="Parcelas:"
                name="months"
                rules={[{ required: true, message: 'Parcelas é obrigatório!' }]}
              >
                <Select className="custom-select">
                  {selectNumbers.slice(0, payment.max_parcels).map((number) => (
                    <Select.Option key={number} value={number}>{`${number}x`}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </Form>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '20px',
            }}
          >
            <Button
              type="primary"
              style={{ width: isPortrait ? '30vw' : '10vw', marginBottom: '20px' }}
              onClick={creditCardHandle}
              loading={loading}
            >
              PAGAR
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default memo(ClientCreditCard)
