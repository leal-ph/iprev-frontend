import React, { memo, useEffect, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { useStores } from '~/hooks/use-stores'
import { Form, Card, Input, Button, message, Select } from 'antd'

import ClientLayout from '~/pages/GlobalLayout'
import { useHistory } from 'react-router-dom'
import { ResponseStatus } from '~/types'
import { MSG_UPDATE_USER_SUCCESS, MSG_UPDATE_USER_ERROR } from '~/utils/messages'

import NumberFormat from 'react-number-format'
import { useMediaQuery } from 'react-responsive'
import { titleStyle } from '../styles'

const ClientProfile = observer(() => {
  const { authStore, lawyerStore, msgraphStore, groupStore } = useStores()

  const [form] = Form.useForm()
  const history = useHistory()

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  const onSave = useCallback(() => {
    form.validateFields().then(async () => {
      if (lawyerStore.currentLawyer) {
        const status = await lawyerStore.editLawyer(
          { ...form.getFieldsValue() },
          lawyerStore.currentLawyer._id!,
        )
        if (status === ResponseStatus.SUCCESS) {
          message.success(MSG_UPDATE_USER_SUCCESS)
          return
        }

        message.error(MSG_UPDATE_USER_ERROR)
      }
    })
  }, [form, lawyerStore])

  const setDefaults = useCallback(() => {
    if (lawyerStore.currentLawyer) {
      form.setFieldsValue({
        name: lawyerStore.currentLawyer.name,
        birthdate: lawyerStore.currentLawyer.birthdate,
        number: lawyerStore.currentLawyer.telephone,
        email: lawyerStore.currentLawyer.email,
        groupId: lawyerStore.currentLawyer.group._id,
        expertise: lawyerStore.currentLawyer.expertise,
        teamsId: lawyerStore.currentLawyer.teamsuserID,
      })
    }
  }, [lawyerStore.currentLawyer, form])

  useEffect(() => {
    if (authStore.loggedUser?._id) {
      lawyerStore.loadLawyer(authStore.loggedUser._id)
    }
  }, [authStore.loggedUser, lawyerStore])

  useEffect(() => {
    if (lawyerStore.currentLawyer) {
      setDefaults()
    }
  }, [lawyerStore.currentLawyer, setDefaults])

  useEffect(() => {
    msgraphStore.loadUsers()
    groupStore.loadGroups()
  }, [groupStore, msgraphStore])

  return (
    <ClientLayout
      title="PERFIL DO ADVOGADO"
      onBack={() => history.push('/admin')}
      isAdminPage
      content={
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Card
            className="custom-card"
            title={<span style={titleStyle('25px')}>DADOS DO ADVOGADO</span>}
            style={{
              width: isPortrait ? '90vw' : '50vw',
              marginRight: '10px',
              height: '60vh',
              overflowY: 'auto',
            }}
          >
            <Form form={form} layout="vertical">
              <Form.Item name="name" key="name" label="Nome Completo:" rules={[{ required: true }]}>
                <Input allowClear className="custom-input" />
              </Form.Item>
              <div style={{ display: 'flex', flexDirection: isPortrait ? 'column' : 'row' }}>
                <Form.Item
                  name="birthdate"
                  key="birthdate"
                  label="Data de Nascimento:"
                  style={{
                    marginRight: isPortrait ? '0' : '10px',
                    width: isPortrait ? '100%' : '50%',
                  }}
                >
                  <NumberFormat
                    style={{
                      boxShadow: '0px 0px 3px #33333380',
                      width: '100%',
                    }}
                    className="ant-input"
                    format="##/##/####"
                    placeholder="DD/MM/AAAA"
                  />
                </Form.Item>
                <Form.Item
                  name="number"
                  key="number"
                  label="Telefone:"
                  style={{ width: isPortrait ? '100%' : '50%' }}
                >
                  <NumberFormat
                    style={{
                      boxShadow: '0px 0px 3px #33333380',
                      width: '100%',
                    }}
                    className="ant-input"
                    format="(##) #####-####"
                    placeholder="(XX) XXXXX-XXXX"
                  />
                </Form.Item>
              </div>
              <Form.Item name="email" key="email" label="E-mail:" rules={[{ required: true }]}>
                <Input allowClear className="custom-input" />
              </Form.Item>
              <Form.Item name="groupId" key="groupId" label="Grupo:" rules={[{ required: true }]}>
                <Select className="custom-select" loading={groupStore.groupsLoading}>
                  {groupStore.groups.map((group) => (
                    <Select.Option value={group._id} key={group._id}>
                      {group.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="expertise"
                key="expertise"
                label="Especialidade:"
                rules={[{ required: true }]}
              >
                <Input allowClear className="custom-input" />
              </Form.Item>
              <Form.Item name="teamsId" key="teamsId" label="Usuário Teams">
                <Select className="custom-select" loading={msgraphStore.usersLoading}>
                  {msgraphStore.users.map((teamsUser) => (
                    <Select.Option value={teamsUser.id} key={teamsUser.id}>
                      {teamsUser.displayName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Button
                style={{ width: isPortrait ? '45vw' : '15vw', marginRight: '1vw' }}
                onClick={() => history.push('/admin/recover')}
              >
                REDEFINIR SENHA
              </Button>
              <Button
                type="primary"
                style={{ width: isPortrait ? '30vw' : '15vw', marginLeft: '1vw' }}
                onClick={onSave}
                loading={lawyerStore.saveLoading}
              >
                SALVAR
              </Button>
            </div>
          </Card>
        </div>
      }
    />
  )
})

export default memo(ClientProfile)
