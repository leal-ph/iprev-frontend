import { Button, Card } from 'antd'
import React, { memo, useCallback } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Client, Payment, PaymentPayer, PaymentItem } from '~/types'
import { formatCurrency } from '~/utils/payment-utils'

const buttonStyle: React.CSSProperties = {
  border: '1px solid #000F34',
}

interface Props {
  client: Client
  payment: Payment
  loading: boolean
  onGenerate: (id: string, email: string, itens: PaymentItem[], payer: PaymentPayer) => void
}

const ClientBankSlip = ({ client, payment, loading, onGenerate }: Props) => {
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  const bankSlipHandle = useCallback(() => {
    if (payment.url) {
      window.open(payment.url)
      return
    }

    const payer = {
      cpf_cnpj: client.cpf,
      name: client.fullname || client.name,
      email: client.email,
      address: {
        zip_code: client.zipcode || '00000-000',
        number: client.telephone || '61 99999-9999',
      },
    }

    onGenerate(payment._id!, client.email, [payment.item], payer)
  }, [
    client.cpf,
    client.email,
    client.fullname,
    client.name,
    client.telephone,
    client.zipcode,
    onGenerate,
    payment._id,
    payment.item,
    payment.url,
  ])

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Card
        className="custom-card"
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: isPortrait ? '80vw' : '20vw',
            marginBottom: '10vh',
          }}
        >
          {/* TODO: Preencher com as informações do Boleto. */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>
              {formatCurrency(payment.item.price_cents / 100)} À VISTA
            </p>
            <p>Clique no botão abaixo para poder o boleto.</p>
            <Button
              type="default"
              style={{ width: isPortrait ? '40vw' : '15vw', ...buttonStyle }}
              onClick={bankSlipHandle}
              loading={loading}
            >
              BAIXAR BOLETO
            </Button>
          </div>
        </div>
        {/* <div style={{ display: 'flex', justifyContent: 'flex-end', width: '82vh' }}>
      <Button
        type="primary"
        style={{ width: '30vh' }}
        onClick={() => bankSlipHandle(false)}
      >
        CONTINUAR
      </Button>
    </div> */}
      </Card>
    </div>
  )
}

export default memo(ClientBankSlip)
