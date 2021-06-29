import React, { memo } from 'react'
import ClientLayout from '~/pages/GlobalLayout'
import { useStores } from '~/hooks/use-stores'
import MenuCard from '../../MenuCard'

import Calendario from '~/assets/img/calendarioiprev@2x.png'
import Judicial from '~/assets/img/judicial@2x.png'
import Benefícios from '~/assets/img/beneficios@2x.jpg'
import Pagamento from '~/assets/img/pagamentoiprev@2x.png'
import { useHistory } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { Alert } from 'antd'

const MenuClientScreen = () => {
  // TODO: Adicionar Ações para Mover em Direção as outras telas.
  // TODO: Verificar Como Colocar a Página até o final.
  // TODO: Deixar Responsivo
  const history = useHistory()

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  return (
    <ClientLayout
      title="Área do Cliente"
      subtitle="Selecione uma opção para prosseguir"
      content={
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: isPortrait ? 'column' : 'row',
              alignItems: isPortrait ? 'center' : 'flex-start',
              justifyContent: 'center',
              paddingTop: isPortrait ? '25vh' : '18vh',
              marginTop: isPortrait ? '-70px' : 0,
            }}
          >
            <MenuCard
              image={Calendario}
              label={'Agendar reunião'}
              onClick={() => history.push('/client/calendar')}
            />
            <MenuCard
              image={Benefícios}
              label={'Consultar Benefícios'}
              onClick={() => history.push('/client/documents/sign')}
            />
            <MenuCard
              image={Judicial}
              label={'Processo Jurídico'}
              onClick={() => history.push('/client/lawsuits')}
            />
            <MenuCard
              image={Pagamento}
              label={'Pagamento'}
              onClick={() => history.push('/client/payment')}
            />
          </div>
          <div
            style={{
              marginTop: '30px',
              width: '50vw',
              textAlign: 'center',
            }}
          >
            <Alert
              message="AVISO!"
              description="Você ainda não é um associado, para finalizar realize o pagamento da taxa de associação mensal."
              type="warning"
              showIcon
            />
          </div>
        </div>
      }
    />
  )
}

export default memo(MenuClientScreen)
