import React, { memo, useCallback } from 'react'

import { Card, Form, Input, Button, message } from 'antd'
import { useForm } from 'antd/es/form/Form'

import Advogados from '~/assets/img/advogados@2x.png'
import AdminLayout from '../GlobalLayout'
import { rowDisplayCenter } from '~/utils/display'
import { useHistory } from 'react-router-dom'
import { useStores } from '~/hooks/use-stores'
import { ResponseStatus } from '~/types'
import {
  MSG_LAWYER_PASSWORD_UPDATED,
  MSG_LAWYER_PASSWORD_UPDATED_ERROR,
  MSG_LAWYER_PASSWORD_CONFIRMATION_ERROR,
  MSG_LAWYER_PASSWORD_UPDATED_UNAUTHORIZED,
} from '~/utils/messages'

const AdminNewPassScreen = () => {
  const [form] = useForm()
  const history = useHistory()
  const { adminStore, authStore } = useStores()

  const newPassHandle = useCallback(() => {
    form
      .validateFields()
      .then(async () => {
        const { oldpassword, newpassword, confirmation } = form.getFieldsValue()

        if (newpassword !== confirmation) {
          message.error(MSG_LAWYER_PASSWORD_CONFIRMATION_ERROR)
          return
        }

        const newPassData = {
          oldpassword: oldpassword,
          newpassword: newpassword,
        }
        if (authStore.loggedUser && authStore.loggedUser._id) {
          const response = await adminStore.updateLawyerPassword(
            newPassData,
            authStore.loggedUser._id,
          )
          if (response === ResponseStatus.SUCCESS) {
            message.success(MSG_LAWYER_PASSWORD_UPDATED)
            history.push('/admin')
            return
          } else if (response === ResponseStatus.INTERNAL_ERROR) {
            message.error(MSG_LAWYER_PASSWORD_UPDATED_ERROR)
            return
          } else if (response === ResponseStatus.UNAUTHORIZED) {
            message.error(MSG_LAWYER_PASSWORD_UPDATED_UNAUTHORIZED)
          }
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }, [adminStore, authStore.loggedUser, form, history])

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
      <div>
        <img style={{ width: '50vw', height: '100vh' }} src={Advogados} alt="Logo" />
      </div>
      <div style={{ width: '50vw', height: '100vh' }}>
        <AdminLayout
          noShowHeader={true}
          noShowFooter={true}
          title="REDEFINIR SENHA"
          subtitle="Insira os dados corretamente para prosseguir"
          onBack={() => history.push('/admin')}
          content={
            <div style={{ ...rowDisplayCenter }}>
              <Card className="custom-card" style={{ width: '30vw' }} title="ÁREA DO ADVOGADO">
                <Form name="admin-login-form" form={form} layout="vertical">
                  <Form.Item
                    key="oldpassword"
                    name="oldpassword"
                    label="Senha atual:"
                    rules={[{ required: true, message: 'Campo obrigatório!' }]}
                  >
                    <Input.Password allowClear className="custom-input" />
                  </Form.Item>
                  <Form.Item
                    key="newpassword"
                    name="newpassword"
                    label="Nova Senha:"
                    rules={[
                      { required: true, message: 'Campo obrigatório!' },
                      { min: 8, message: 'Sua senha deve conter no mínimo 8 caracteres!' },
                    ]}
                  >
                    <Input.Password allowClear className="custom-input" />
                  </Form.Item>
                  <Form.Item
                    key="confirmation"
                    name="confirmation"
                    label="Confirmação de nova senha:"
                    rules={[
                      { required: true, message: 'Campo obrigatório!' },
                      { min: 8, message: 'Sua senha deve conter no mínimo 8 caracteres!' },
                    ]}
                  >
                    <Input.Password allowClear className="custom-input" />
                  </Form.Item>
                </Form>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                  <Button type="primary" style={{ width: '15vw' }} onClick={newPassHandle}>
                    CONTINUAR
                  </Button>
                </div>
              </Card>
            </div>
          }
        />
      </div>
    </div>
  )
}

export default memo(AdminNewPassScreen)
