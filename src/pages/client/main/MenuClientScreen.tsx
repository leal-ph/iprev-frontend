import React, { memo, useEffect } from 'react'
import ClientLayout from '~/pages/GlobalLayout'
import { useStores } from '~/hooks/use-stores'
import MenuCard from '../../MenuCard'

import Calendario from '~/assets/img/reunioes_bca_2.jpg'
import Documentos from '~/assets/img/documento@2x.png'
import Assinado from '~/assets/img/assinados_bca_2.jpg'
import Processo from '~/assets/img/processo_bca_2.jpg'
import Pagamento from '~/assets/img/pagamento@2x.png'
import { useHistory } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'

declare global {
  interface Window {
    chatwootSettings: any
    chatwootSDK: any
    $chatwoot: any
  }
}

const MenuClientScreen = () => {
  // TODO: Adicionar Ações para Mover em Direção as outras telas.
  // TODO: Verificar Como Colocar a Página até o final.
  // TODO: Deixar Responsivo
  const history = useHistory()

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
  const { authStore } = useStores()

  useEffect(() => {
    window.chatwootSettings = {
      hideMessageBubble: false,
      position: 'right',
      locale: 'pt-br',
      type: 'expanded_bubble',
      launcherTitle: 'Fale Conosco!',
    }

    const BASE_URL = 'http://localhost:4000'
    const script = document.createElement('script')
    script.src = BASE_URL + '/packs/js/sdk.js'
    script.async = !0
    document.body.appendChild(script)

    script.onload = function () {
      window.chatwootSDK.run({
        websiteToken: 'dPEKMYrXJ5gHZ3t1X7DgAMWo',
        baseUrl: BASE_URL,
      })
      setTimeout(function () {
        window.$chatwoot.setUser(authStore.loggedUser?.email, {
          email: authStore.loggedUser?.email,
          name: authStore.loggedUser?.name,
        })
      }, 5000)
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [authStore.loggedUser])

  return (
    <ClientLayout
      title="ÁREA DO CLIENTE"
      subtitle="Selecione uma opção para prosseguir"
      content={
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
            label={'AGENDAR REUNIÕES'}
            onClick={() => history.push('/client/calendar')}
          />
          <MenuCard
            image={Documentos}
            label={'ANEXAR DOCUMENTOS'}
            onClick={() => history.push('/client/documents')}
          />
          <MenuCard
            image={Assinado}
            label={'ASSINAR DOCUMENTOS'}
            onClick={() => history.push('/client/documents/sign')}
          />
          <MenuCard
            image={Processo}
            label={'ANDAMENTO DE PROCESSOS'}
            onClick={() => history.push('/client/lawsuits')}
          />
          <MenuCard
            image={Pagamento}
            label={'ÁREA DE PAGAMENTO'}
            onClick={() => history.push('/client/payment')}
          />
        </div>
      }
    />
  )
}

export default memo(MenuClientScreen)
