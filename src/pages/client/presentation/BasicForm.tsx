import React, { memo, useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { Card, Form, Input, Checkbox, Button, message, Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'
import NumberFormat from 'react-number-format'
import '~/assets/styles/App.less'

import PresentationLayout from './PresentationLayout'

import { useHistory } from 'react-router-dom'
import { useStores } from '~/hooks/use-stores'
import { ResponseStatus } from '~/types'
import { useMediaQuery } from 'react-responsive'

import { policy, use_terms } from './terms'

import ReactHtmlParser from 'react-html-parser'

const BasicForm = observer(() => {
  const { clientStore } = useStores()

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  const history = useHistory()
  const [form] = useForm()
  const [confirmAccept, setConfirmAccept] = useState(false)
  const [formattedBirthdate, setFormattedBirthdate] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [termsModalState, setTermsModalState] = useState(false)
  const [policyModalState, setPolicyModalState] = useState(false)

  // eslint-disable-next-line new-cap
  const parsedHTML_policy = ReactHtmlParser(policy)
  // eslint-disable-next-line new-cap
  const parsedHTML_terms = ReactHtmlParser(use_terms)

  const confirmHandle = useCallback(() => {
    form
      .validateFields()
      .then(async () => {
        if (confirmAccept) {
          const { name, email } = form.getFieldsValue()

          const trimmedName = name.trim()

          if (trimmedName.split(' ').length === 1) {
            message.error('Insira um nome completo!')
            return
          }

          const cpf_placeholder = `cpf-#######-${(Date.now() / 1000).toString()}`
          const rg_placeholder = `rg-#######-${(Date.now() / 1000).toString()}`

          const response = await clientStore.saveBasic(
            email,
            formattedBirthdate,
            phoneNumber,
            trimmedName,
            cpf_placeholder,
            rg_placeholder,
          )
          if (response === ResponseStatus.SUCCESS) {
            history.push('/client/form')
          } else if (response === ResponseStatus.DUPLICATE_REGISTER) {
            message.error('E-mail já cadastrado!')
          } else if (response === ResponseStatus.DUPLICATE_REGISTER_EXISTS_AS_LAWYER) {
            message.error('E-mail já cadastrado como advogado do sistema!')
          }
        } else {
          message.error('Você deve concordar com os termos antes de prosseguir!')
        }
      })
      .catch(() => {
        message.error('Erro ao validar dados.')
      })
  }, [formattedBirthdate, confirmAccept, phoneNumber, clientStore, form, history])

  return (
    <PresentationLayout>
      <div
        title="Associação IPREV"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <span className="subtitle" style={{ fontSize: '28px' }}>
          Associação IPREV
        </span>
        <span style={{ textAlign: 'center' }}>Seja um beneficiário e associe-se ao IPREV.</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Card
          className="custom-card"
          style={{ marginTop: '10px', width: isPortrait ? '90vw' : '50vw' }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="Nome Completo:"
              key="name"
              name="name"
              rules={[{ required: true, message: 'Nome é obrigatório!' }]}
            >
              <Input className="custom-input" allowClear />
            </Form.Item>
            <div style={{ display: 'flex', flexDirection: isPortrait ? 'column' : 'row' }}>
              <Form.Item
                name="birthdate"
                key="birthdate"
                style={{ width: '100%', marginRight: '10px' }}
                label="Data de Nascimento:"
                required
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
                  onValueChange={(values) => {
                    const { formattedValue } = values
                    setFormattedBirthdate(formattedValue)
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Telefone:"
                key="telephone"
                name="telephone"
                style={{ width: '100%' }}
                rules={[{ required: true, message: 'Telefone obrigatório!' }]}
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
                  onValueChange={(values) => {
                    const { formattedValue } = values
                    setPhoneNumber(formattedValue)
                  }}
                />
              </Form.Item>
            </div>
            <Form.Item
              label="E-mail:"
              key="email"
              name="email"
              rules={[
                {
                  type: 'email',
                  message: 'Endereço de e-mail inválido!',
                },
                {
                  required: true,
                  message: 'Endereço de e-mail obrigatório!',
                },
              ]}
            >
              <Input className="custom-input" allowClear />
            </Form.Item>
            <Form.Item key="confirm" name="confirm">
              <Checkbox
                checked={confirmAccept}
                onChange={() => setConfirmAccept(!confirmAccept)}
              ></Checkbox>
              {'  '}Declaro que li e aceito as {/* eslint-disable-next-line */}
              <a onClick={() => setPolicyModalState(true)}>Políticas de Privacidade</a> e{' '}
              {/* eslint-disable-next-line */}
              <a onClick={() => setTermsModalState(true)}>Termos de Uso</a>
            </Form.Item>
          </Form>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <Button
              type="primary"
              style={{ width: isPortrait ? '40vw' : '20vw' }}
              onClick={confirmHandle}
              loading={clientStore.saveLoading}
            >
              CONTINUAR
            </Button>
          </div>
        </Card>
      </div>
      <Modal
        title="Política de Privacidade"
        visible={policyModalState}
        cancelButtonProps={{ style: { display: 'none' } }}
        onOk={() => setPolicyModalState(false)}
        onCancel={() => setPolicyModalState(false)}
        width="90%"
      >
        {parsedHTML_policy}
        {/*  <div
          dangerouslySetInnerHTML={{
            __html: termstext,
          }}
        ></div> */}
      </Modal>
      <Modal
        title="Termos de Uso"
        visible={termsModalState}
        cancelButtonProps={{ style: { display: 'none' } }}
        onOk={() => setTermsModalState(false)}
        onCancel={() => setTermsModalState(false)}
        width="90%"
      >
        {parsedHTML_terms}
        {/*  <div
          dangerouslySetInnerHTML={{
            __html: termstext,
          }}
        ></div> */}
      </Modal>
    </PresentationLayout>
  )
})

export default memo(BasicForm)
