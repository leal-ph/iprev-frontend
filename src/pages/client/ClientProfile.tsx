import React, { memo, useEffect, useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { useStores } from '~/hooks/use-stores'
import { Form, Card, Input, Button, message, Select } from 'antd'

import ClientLayout from '~/pages/GlobalLayout'
import { useHistory } from 'react-router-dom'
import { ResponseStatus } from '~/types'
import { MSG_UPDATE_USER_SUCCESS, MSG_UPDATE_USER_ERROR } from '~/utils/messages'
import NumberFormat from 'react-number-format'
import { useMediaQuery } from 'react-responsive'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CustomModal from '~/assets/components/CustomModal'

import { estados } from '~/utils/estados-cidades.json'
import { faLock } from '@fortawesome/free-solid-svg-icons'

import { titleStyle } from '../styles'

const ClientProfile = observer(() => {
  const { authStore, clientStore, adminStore } = useStores()

  const [form] = Form.useForm()
  const [newpassform] = Form.useForm()
  const history = useHistory()

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
  const [newPassModalState, setNewPassModalState] = useState(false)

  const maritals = ['Solteiro', 'Casado', 'Viúvo', 'Separado judicialmente', 'Divorciado']

  const onSave = useCallback(() => {
    form.validateFields().then(async () => {
      if (clientStore.currentUser) {
        const status = await clientStore.editUser(
          { ...form.getFieldsValue() },
          clientStore.currentUser._id,
        )
        if (status === ResponseStatus.SUCCESS) {
          message.success(MSG_UPDATE_USER_SUCCESS)
          return
        }

        message.error(MSG_UPDATE_USER_ERROR)
      }
    })
  }, [form, clientStore])

  const onEditPass = useCallback(() => {
    setNewPassModalState(true)
  }, [])

  const onChangePass = useCallback(() => {
    newpassform.validateFields().then(async () => {
      const { oldpwd, newpwd } = newpassform.getFieldsValue()

      const newPassData = {
        oldpassword: oldpwd,
        newpassword: newpwd,
      }
      if (authStore.loggedUser && authStore.loggedUser._id) {
        const response = await adminStore.updateClientPassword(
          newPassData,
          authStore.loggedUser._id,
        )
        if (response === ResponseStatus.SUCCESS) {
          message.success('Senha atualizada com sucesso!')
          setNewPassModalState(false)
          return
        } else if (response === ResponseStatus.INTERNAL_ERROR) {
          message.error('Erro interno!')
          return
        } else if (response === ResponseStatus.UNAUTHORIZED) {
          message.error('Senha atual incorreta, favor verificar!')
          return
        }
      }
    })
    // setNewPassModalState(true)
  }, [newpassform, authStore.loggedUser, adminStore])

  const setDefaults = useCallback(() => {
    if (clientStore.currentUser) {
      form.setFieldsValue({
        name: clientStore.currentUser.name,
        birthdate: clientStore.currentUser.birthdate,
        number: clientStore.currentUser.telephone,
        cpf: clientStore.currentUser.cpf,
        rg: clientStore.currentUser.rg,
        zipcode: clientStore.currentUser.zipcode,
        city: clientStore.currentUser.city,
        address: clientStore.currentUser.address,
        state: clientStore.currentUser.state,
        profession: clientStore.currentUser.profession,
        marital_status: clientStore.currentUser.marital_status,
        rg_consignor: clientStore.currentUser.rg_consignor,
        email: clientStore.currentUser.email,
      })
    }
  }, [clientStore.currentUser, form])

  useEffect(() => {
    if (authStore.loggedUser?._id) {
      clientStore.loadClient(authStore.loggedUser._id)
    }
  }, [authStore.loggedUser, clientStore])

  useEffect(() => {
    if (clientStore.currentUser) {
      setDefaults()
    }
  }, [clientStore.currentUser, setDefaults])

  return (
    <ClientLayout
      title="PERFIL DO CLIENTE"
      onBack={() => history.push('/client/menu')}
      content={
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Card
            className="custom-card"
            title={<span style={titleStyle('25px')}>DADOS DO CLIENTE</span>}
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
                  style={{ marginRight: '10px', width: isPortrait ? '100%' : '50%' }}
                >
                  <NumberFormat
                    style={{
                      boxShadow: '0px 0px 3px #33333380',
                      width: '100%',
                      marginRight: '10px',
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
                      marginRight: '10px',
                    }}
                    className="ant-input"
                    format="(##) #####-####"
                    placeholder="(XX) XXXXX-XXXX"
                  />
                </Form.Item>
              </div>
              <Form.Item name="profile" key="profile" label="Perfil:">
                <Input className="custom-input" disabled />
              </Form.Item>
              <Form.Item name="cpf" key="cpf" label="CPF:" rules={[{ required: true }]}>
                <Input className="custom-input" disabled />
              </Form.Item>
              <Form.Item
                name="email"
                key="email"
                label="E-Mail:"
                rules={[{ required: true }, { type: 'email', message: 'Endereço inválido!' }]}
              >
                <Input className="custom-input" />
              </Form.Item>
              <Form.Item name="rg" key="rg" label="RG:" rules={[{ required: true }]}>
                <Input className="custom-input" />
              </Form.Item>
              <Form.Item
                name="rg_consignor"
                key="rg_consignor"
                label="Órgão Expedidor:"
                rules={[{ required: true, message: 'Campo obrigatório!' }]}
              >
                <Input className="custom-input" />
              </Form.Item>
              <Form.Item name="zipcode" key="zipcode" label="CEP:" rules={[{ required: true }]}>
                <Input className="custom-input" />
              </Form.Item>
              <Form.Item name="state" key="state" label="Estado:" rules={[{ required: true }]}>
                <Select className="custom-select" placeholder="Selecione o estado">
                  {estados.map((state) => (
                    <Select.Option value={state.nome} key={state.nome}>
                      {state.nome}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="city" key="city" label="Cidade:" rules={[{ required: true }]}>
                <Input className="custom-input" />
              </Form.Item>
              <Form.Item
                name="profession"
                key="profession"
                label="Profissão:"
                rules={[{ required: true }]}
              >
                <Input className="custom-input" />
              </Form.Item>
              <Form.Item
                name="marital_status"
                key="marital_status"
                label="Estado Civil:"
                rules={[{ required: true }]}
              >
                <Select showSearch className="custom-select">
                  {maritals.map((status) => (
                    <Select.Option value={status} key={status}>
                      {status}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="address"
                key="address"
                label="Endereço:"
                rules={[{ required: true }]}
              >
                <Input className="custom-input" />
              </Form.Item>
              <Form.Item name="pwd" key="pwd">
                <Button
                  type="primary"
                  style={{
                    backgroundColor: '#A81A1A',
                    color: '#FFFFFF',
                    borderColor: '#A81A1A',
                    width: isPortrait ? '15vw' : '10vw',
                  }}
                  onClick={onEditPass}
                >
                  <FontAwesomeIcon
                    icon={faLock}
                    size="1x"
                    style={{ cursor: 'pointer', marginRight: '10px' }}
                  />{' '}
                  {'ALTERAR SENHA'}
                </Button>
              </Form.Item>
            </Form>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Button
                type="primary"
                style={{ width: isPortrait ? '30vw' : '20vw' }}
                onClick={onSave}
                loading={clientStore.saveLoading}
              >
                SALVAR
              </Button>
            </div>
          </Card>
          <CustomModal
            visible={newPassModalState}
            onCancel={() => setNewPassModalState(false)}
            destroyOnClose
            title="Insira os dados para modificação da senha:"
            onOk={onChangePass}
            cancelButtonProps={{ style: { display: 'none' } }}
            content={
              <Form form={newpassform} layout="vertical">
                <Form.Item
                  name="oldpwd"
                  key="oldpwd"
                  label="Senha atual:"
                  rules={[{ required: true, message: 'Campo obrigatório!' }]}
                >
                  <Input.Password className="custom-input" />
                </Form.Item>
                <Form.Item
                  name="newpwd"
                  key="newpwd"
                  label="Nova senha:"
                  rules={[
                    { required: true, message: 'Campo obrigatório!' },
                    { min: 8, message: 'Sua senha deve conter no mínimo 8 caracteres!' },
                  ]}
                >
                  <Input.Password className="custom-input" />
                </Form.Item>
              </Form>
            }
          />
        </div>
      }
    />
  )
})

export default memo(ClientProfile)
