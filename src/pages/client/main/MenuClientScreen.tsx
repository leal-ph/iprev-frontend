import React, { memo, useEffect } from 'react'
import ClientLayout from '~/assets/components/GlobalLayout'
import MenuCard from '~/assets/components/MenuCard'
import { useStores } from '~/hooks/use-stores'

import Calendario from '~/assets/img/calendarioiprev@2x.png'
import Judicial from '~/assets/img/judicial@2x.png'
import Benefícios from '~/assets/img/beneficios@2x.jpg'
import Pagamento from '~/assets/img/pagamentoiprev@2x.png'
import { useHistory } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'

const MenuClientScreen = () => {
  // TODO: Adicionar Ações para Mover em Direção as outras telas.
  // TODO: Verificar Como Colocar a Página até o final.
  // TODO: Deixar Responsivo
  const history = useHistory()
  const { clientStore, paymentStore } = useStores()

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  useEffect(() => {
    if (clientStore.currentUser) {
      paymentStore.loadClientPayments(clientStore.currentUser._id)
    }
  }, [paymentStore, clientStore.currentUser])

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
              onClick={() => history.push('/client/benefit')}
            />
            <MenuCard
              image={Judicial}
              label={'Processo Jurídico'}
              onClick={() => window.open('https://app.bocayuvaadvogados.com.br/client', '_blank')}
            />
            <MenuCard
              image={Pagamento}
              label={'Pagamento'}
              onClick={() => history.push('/client/payment')}
            />
          </div>
        </div>
      }
    />
  )
}

export default memo(MenuClientScreen)
