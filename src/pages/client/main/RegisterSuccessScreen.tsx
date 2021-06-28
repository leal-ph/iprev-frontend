import React, { memo } from 'react'
import ClientLayout from '~/pages/GlobalLayout'
// import { Layout } from 'antd'
import MenuCard from '../../MenuCard'

import Cliente from '~/assets/img/clientes@2x.png'
import Processo from '~/assets/img/processo@2x.png'
import { useHistory } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'

// const { Content } = Layout

const RegisterSuccessScreen = () => {
  const history = useHistory()

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  return (
    <ClientLayout
      title="CADASTRO FINALIZADO COM SUCESSO!"
      subtitle="Primeiro passo finalizado, agora escolha uma das opções abaixo para seguir."
      content={
        <div
          style={{
            display: 'flex',
            flexDirection: isPortrait ? 'column' : 'row',
            alignItems: isPortrait ? 'center' : 'flex-start',
            justifyContent: 'center',
            paddingTop: isPortrait ? '25vh' : '18vh',
          }}
        >
          <MenuCard
            image={Processo}
            label={'REQUERIMENTO ADMINISTRATIVO / PROCESSO'}
            text={'Inicie o andamento do processo sem a necessidade de uma consultoria jurídica.'}
            onClick={() => history.push('/client/contract')}
          />
          <MenuCard
            image={Cliente}
            label={'CONSULTORIA JURÍDICA'}
            text={
              'Opte por uma consultoria jurídica antes de dar seguimento na abertura do processo.'
            }
            onClick={() => history.push('/client/aceite')}
          />
        </div>
      }
    />
  )
}

export default memo(RegisterSuccessScreen)
