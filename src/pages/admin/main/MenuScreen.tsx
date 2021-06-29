import React, { memo, useEffect } from 'react'
import AdminLayout from '~/pages/GlobalLayout'
import { Layout } from 'antd'
import MenuCard from '../../MenuCard'

import Calendario from '~/assets/img/calendarioiprev@2x.png'
import Associados from '~/assets/img/associados@2x.png'
import Cadastro from '~/assets/img/consultaiprev@2x.png'
import Perfil from '~/assets/img/beneficios@2x.jpg'
import { useHistory } from 'react-router-dom'
import { useStores } from '~/hooks/use-stores'
import { useMediaQuery } from 'react-responsive'

const { Content } = Layout

const MenuScreen = () => {
  // TODO: Adicionar Ações para Mover em Direção as outras telas.
  // TODO: Verificar Como Colocar a Página até o final.
  // TODO: Deixar Responsivo
  const { authStore, lawyerStore, clientStore } = useStores()

  const history = useHistory()

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  useEffect(() => {
    if (authStore.loggedUser) {
      lawyerStore.loadLawyer(authStore.loggedUser._id)
    }
  }, [authStore.loggedUser, clientStore, lawyerStore])

  return (
    <AdminLayout
      title="Área de Administração"
      subtitle="Selecione uma opção para prosseguir"
      isAdminPage
      content={
        <Content
          className="contentMenus"
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
            label={'Agendamentos'}
            onClick={() => history.push('/admin/calendar')}
          />
          <MenuCard
            image={Associados}
            label={'Associados'}
            onClick={() => history.push('/admin/clients')}
          />
          <MenuCard
            image={Perfil}
            label={'Cadastrar Benefícios'}
            onClick={() => history.push('/admin/benefits')}
          />
          <MenuCard
            image={Cadastro}
            label={'Cadastrar Advogado'}
            onClick={() => history.push('/admin/lawyers')}
          />
        </Content>
      }
    />
  )
}

export default memo(MenuScreen)
