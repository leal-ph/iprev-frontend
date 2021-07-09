import React, { memo } from 'react'
import ClientLayout from '~/assets/components/GlobalLayout'
// import { Layout } from 'antd'
import MenuCard from '~/assets/components/MenuCard'

import Cliente from '~/assets/img/associados@2x.png'
import Processo from '~/assets/img/judicial@2x.png'
import { useHistory } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'

// const { Content } = Layout

const RegisterSuccessScreen = () => {
  const history = useHistory()

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  return (
    <ClientLayout
      title="Cadastro finalizado!"
      subtitle="Primeiro passo finalizado, agora escolha uma das opções abaixo para seguir."
      content={
        <div
          style={{
            display: 'flex',
            flexDirection: isPortrait ? 'column' : 'row',
            alignItems: isPortrait ? 'center' : 'flex-start',
            justifyContent: 'center',
            paddingTop: isPortrait ? '25vh' : '18vh',
            marginBottom: '20px',
          }}
        >
          <MenuCard
            image={Processo}
            label={'Andamento Processual'}
            text={'Inicie o andamento do processo sem a necessidade de uma consultoria jurídica.'}
            onClick={() => window.open('https://app.bocayuvaadvogados.com.br/client', '_blank')}
          />
          <MenuCard
            image={Cliente}
            label={'Portal do Associado'}
            text={'Visite nosso portal do associado e consulte os benefícios disponíveis.'}
            onClick={() => history.push('/client/aceite')}
          />
        </div>
      }
    />
  )
}

export default memo(RegisterSuccessScreen)
