import React, { memo, useCallback, useState } from 'react'

import { Card, Form, Input, Button, message } from 'antd'
import { useForm } from 'antd/es/form/Form'

import * as EmailValidator from 'email-validator'

import Advogados from '~/assets/img/login.png'
import AdminLayout from '../GlobalLayout'
import { rowDisplayCenter } from '~/utils/display'

import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import CustomModal from '~/assets/components/CustomModal'

import { useStores } from '~/hooks/use-stores'
import { ResponseStatus } from '~/types'
import {
  MSG_LOGIN_SUCCESS,
  MSG_NO_PERMISSION,
  MSG_WRONG_PASSWORD,
  MSG_USER_NOT_FOUND,
} from '~/utils/messages'
import { useHistory } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { titleStyle } from '../styles'

const AdminLoginScreen = () => {
  const { authStore } = useStores()

  const history = useHistory()

  const [form] = useForm()

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  const [rememberEmail, setRememberEmail] = useState<string>('')
  const [renewCode, setRenewCode] = useState<string>('')
  const [newPass, setNewPass] = useState<string>('')
  const [newPassConfirm, setNewPassConfirm] = useState<string>('')
  const [successRenewVisible, setSuccessRenewVisible] = useState(false)
  const [renewPassModalState, setRenewPassModalState] = useState(false)
  const [renewCodeVisible, setRenewCodeVisible] = useState(false)

  const loginHandle = useCallback(() => {
    form
      .validateFields()
      .then(async () => {
        const { mail, password } = form.getFieldsValue()
        const response = await authStore.login(mail, password, 'email')

        if (response === ResponseStatus.SUCCESS) {
          if (authStore.loggedUser?.pLawyer) {
            message.success(MSG_LOGIN_SUCCESS)
            history.push('/admin')
            return
          } else {
            message.error(MSG_NO_PERMISSION)
            return
          }
        } else if (response === ResponseStatus.WRONG_PASSWORD) {
          message.error(MSG_WRONG_PASSWORD)
          history.push('/admin/login')
          return
        } else if (response === ResponseStatus.USER_NOT_FOUND) {
          message.error(MSG_USER_NOT_FOUND)
          history.push('/admin/login')
          return
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }, [authStore, form, history])

  const rememberPassHandle = useCallback(async () => {
    if (EmailValidator.validate(rememberEmail)) {
      const response = await authStore.renewPassword(rememberEmail)
      if (response === ResponseStatus.SUCCESS) {
        setRenewPassModalState(false)
        // setSuccessRenewVisible(true)
        setRenewCodeVisible(true)
        return
      } else if (response === ResponseStatus.USER_NOT_FOUND) {
        message.error('E-mail Inexistente!')
        return
      } else {
        message.error('Erro Desconhecido!')
        return
      }
    } else {
      message.error('E-mail Inválido!')
    }
  }, [authStore, rememberEmail])

  const renewPassHandle = useCallback(async () => {
    if (newPass !== newPassConfirm) {
      message.error('Confirmação de senha inválida!')
      return
    }

    if (newPass.length < 8) {
      message.error('Senha muito curta. Use no mínimo 8 caracteres.')
      return
    }

    const response = await authStore.renewPasswordCode(
      rememberEmail,
      newPass,
      newPassConfirm,
      renewCode,
    )

    if (response === ResponseStatus.SUCCESS) {
      setRenewCodeVisible(false)
      setSuccessRenewVisible(true)
      return
    } else if (response === ResponseStatus.INVALID_CODE) {
      message.error('Código inválido!')
      return
    } else if (response === ResponseStatus.NO_RENEW_PERMISSION) {
      message.error('Sem permissão para renovar senha. Realize o pedido de troca novamente!')
      return
    } else if (response === ResponseStatus.EXPIRED_CODE) {
      message.error('Código expirado. Faça a requisição novamente para gerar um novo código!')
      return
    } else {
      message.error('Erro desconhecido. Informe o escritório.')
      return
    }
  }, [authStore, rememberEmail, newPass, newPassConfirm, renewCode])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100vw',
        height: '100vh',
      }}
    >
      {!isPortrait && (
        <div style={{ width: '50vw', height: '100vh' }}>
          <img style={{ width: '50vw', height: '100vh' }} src={Advogados} alt="Logo" />
        </div>
      )}
      <div style={{ width: isPortrait ? '100vw' : '50vw', height: '100vh' }}>
        <AdminLayout
          noShowHeader={true}
          noShowFooter={false}
          title="Acesso à área admnistrativa"
          subtitle="Insira os dados corretamente para prosseguir"
          content={
            <div style={{ ...rowDisplayCenter }}>
              <Card
                className="custom-card"
                style={{ width: isPortrait ? '90vw' : '30vw' }}
                title={<span style={titleStyle('25px')}>Área de administração</span>}
              >
                <Form name="admin-login-form" form={form} layout="vertical" onFinish={loginHandle}>
                  <Form.Item
                    key="mail"
                    name="mail"
                    label="E-mail:"
                    required
                    rules={[{ required: true, message: 'E-Mail obrigatório!' }]}
                  >
                    <Input allowClear className="custom-input" />
                  </Form.Item>
                  <Form.Item
                    key="password"
                    name="password"
                    label="Senha:"
                    required
                    rules={[{ required: true, message: 'Senha obrigatória!' }]}
                  >
                    <Input.Password allowClear className="custom-input" />
                  </Form.Item>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={() => setRenewPassModalState(true)}
                    >
                      Esqueceu a senha?
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{
                          width: isPortrait ? '30vw' : '15vw',
                        }}
                        // onClick={loginHandle}
                      >
                        <p
                          style={{
                            color: '#fff',
                            fontFamily: 'Lato',
                          }}
                        >
                          Continuar
                        </p>
                      </Button>
                    </Form.Item>
                  </div>
                  <div>
                    <CustomModal
                      visible={renewPassModalState}
                      onCancel={() => setRenewPassModalState(false)}
                      destroyOnClose
                      cancelText="Cancelar"
                      style={{ animationDuration: '0s' }}
                      title="Informações para recuperação de senha"
                      onOk={rememberPassHandle}
                      content={
                        <div>
                          <span>Insira o e-mail cadastrado para recuperar sua senha:</span>
                          <Input
                            style={{ width: '100%', marginTop: '10px' }}
                            value={rememberEmail}
                            onChange={(e) => setRememberEmail(e.target.value)}
                            className="custom-input"
                            placeholder="E-Mail"
                          ></Input>
                        </div>
                      }
                    />
                  </div>
                  <div>
                    <CustomModal
                      visible={successRenewVisible}
                      cancelButtonProps={{ style: { display: 'none' } }}
                      cancelText="Cancelar"
                      style={{ animationDuration: '0s' }}
                      onOk={() => setSuccessRenewVisible(false)}
                      content={
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 'bold',
                              marginBottom: '10px',
                              width: isPortrait ? '90vw' : '50vw',
                              textAlign: 'center',
                            }}
                          >
                            <p>Senha atualizada com sucesso!</p>
                            <p>Faça login novamente para confirmar.</p>
                          </span>
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            size="5x"
                            style={{ color: 'green' }}
                          />
                        </div>
                      }
                    />
                  </div>
                  <div>
                    <CustomModal
                      visible={renewCodeVisible}
                      cancelButtonProps={{ style: { display: 'none' } }}
                      okButtonProps={{ style: { display: 'none' } }}
                      cancelText="Cancelar"
                      style={{ animationDuration: '0s' }}
                      onCancel={(e) => {
                        e.stopPropagation()
                        setRenewCodeVisible(false)
                      }}
                      onOk={() => setRenewCodeVisible(false)}
                      content={
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 'bold',
                              marginBottom: '10px',
                              width: isPortrait ? '90vw' : '50vw',
                              textAlign: 'center',
                            }}
                          >
                            <p>E-mail de troca de senha enviado com sucesso.</p>
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              size="5x"
                              style={{ color: 'green' }}
                            />
                            <p>Insira o código enviado na caixa abaixo para recuperar sua senha:</p>
                          </span>
                          <Input
                            style={{ width: '30%', marginTop: '10px' }}
                            value={renewCode}
                            onChange={(e) => setRenewCode(e.target.value)}
                            className="custom-input"
                            placeholder="Código"
                          ></Input>
                          <Input.Password
                            style={{ width: '60%', marginTop: '10px' }}
                            value={newPass}
                            onChange={(e) => setNewPass(e.target.value)}
                            className="custom-input"
                            placeholder="Nova Senha"
                          ></Input.Password>
                          <Input.Password
                            style={{ width: '60%', marginTop: '10px' }}
                            value={newPassConfirm}
                            onChange={(e) => setNewPassConfirm(e.target.value)}
                            className="custom-input"
                            placeholder="Confirmação"
                          ></Input.Password>
                          <Button
                            type="primary"
                            htmlType="submit"
                            style={{ width: isPortrait ? '30vw' : '15vw', marginTop: '10px' }}
                            onClick={renewPassHandle}
                          >
                            ENVIAR
                          </Button>
                        </div>
                      }
                    />
                  </div>
                </Form>
              </Card>
            </div>
          }
        />
      </div>
    </div>
  )
}

export default memo(AdminLoginScreen)
