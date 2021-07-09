import React, { memo, useCallback, useState } from 'react'
import { Card, Form, Input, Button, message, Select } from 'antd'
import { useForm } from 'antd/es/form/Form'

import PresentationLayout from './PresentationLayout'
import ClientLayout from '~/assets/components/GlobalLayout'
import NumberFormat from 'react-number-format'

import { useStores } from '~/hooks/use-stores'
import { ResponseStatus } from '~/types'
import { useHistory } from 'react-router-dom'
import { MSG_PASSWORD_NOT_MATCH } from '~/utils/messages'
import { cpf } from 'cpf-cnpj-validator'
import cep from 'cep-promise'

import { estados } from '~/utils/estados-cidades.json'
import { useMediaQuery } from 'react-responsive'

const AdditionalForm = () => {
  const { clientStore, authStore } = useStores()
  const history = useHistory()

  const maritals = [
    'Solteiro(a)',
    'Casado(a)',
    'Viúvo(a)',
    'Separado(a) judicialmente',
    'Divorciado(a)',
  ]

  const [CPF, setCPF] = useState('')
  const [searchingCep, setSearchingCep] = useState(false)
  const [state, setState] = useState('')
  // const [city, setCity] = useState('')
  const [cities, setCities] = useState<string[]>([])
  const [form] = useForm()

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
  const { Search } = Input

  const fillByCep = useCallback(async () => {
    const cepForm = form.getFieldValue('cep')

    try {
      setSearchingCep(true)
      const cepInfo = await cep(cepForm)
      setSearchingCep(false)
      if (cepInfo) {
        const parsedState = estados.filter((estado) => estado.sigla === cepInfo.state)
        setState(parsedState[0].nome)

        form.setFieldsValue({
          city: cepInfo.city,
          state: parsedState[0].nome,
          address: cepInfo.street,
        })
      }
    } catch {
      message.error('CEP Inválido!')
      setSearchingCep(false)
      return
    }
  }, [form])

  const confirmHandle = useCallback(() => {
    form
      .validateFields()
      .then(async () => {
        const {
          rg,
          cep,
          city,
          address,
          password,
          confirmation,
          profession,
          marital_status,
          rg_consignor,
        } = form.getFieldsValue()

        if (password !== confirmation) {
          message.error(MSG_PASSWORD_NOT_MATCH)
          return
        }

        if (!cpf.isValid(CPF)) {
          message.error('CPF Inválido! Verifique o CPF inserido e tente novamente!')
          return
        }

        const cpfExists = await clientStore.verifyCPFExists(CPF)

        if (cpfExists === ResponseStatus.DUPLICATE_REGISTER_CPF) {
          message.error(
            'CPF já cadastrado no sistema. Informe o escritório caso este CPF seja seu e nunca tenha feito o cadastro.',
          )
          return
        }

        const rgExists = await clientStore.verifyRGExists(rg)

        if (rgExists === ResponseStatus.DUPLICATE_REGISTER_RG) {
          message.error(
            'RG já cadastrado no sistema. Informe o escritório caso este RG seja seu e nunca tenha feito o cadastro.',
          )
          return
        }

        const response = await clientStore.updateAdditionalInfo(
          CPF,
          rg,
          cep,
          state,
          city,
          address,
          profession,
          marital_status,
          password,
          rg_consignor,
          true,
        )

        if (response === ResponseStatus.SUCCESS) {
          if (clientStore.currentUser) {
            const loginResponse = await authStore.login(
              clientStore.currentUser.email,
              password,
              'email',
            )

            if (loginResponse === ResponseStatus.SUCCESS) {
              history.push('/client/registersuccess')
            }
          }
        } else if (response === ResponseStatus.DUPLICATE_REGISTER_CPF) {
          message.error(
            'CPF já cadastrado no sistema. Informe o escritório caso este CPF seja seu e nunca tenha feito o cadastro.',
          )
        } else if (response === ResponseStatus.DUPLICATE_REGISTER_RG) {
          message.error(
            'RG já cadastrado no sistema. Informe o escritório caso este RG seja seu e nunca tenha feito o cadastro.',
          )
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }, [CPF, state, authStore, clientStore, form, history])

  const onStateChange = useCallback(
    async (selectedState: string) => {
      await setState(selectedState)

      const filterCity = estados.filter((estado) => estado.nome === selectedState)

      setCities(filterCity[0].cidades)
    },
    [setState, setCities],
  )

  return (
    <ClientLayout
      content={
        <PresentationLayout>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <span className="title">FORMULÁRIO ADICIONAL</span>
            <span className="subtitle" style={{ textAlign: 'center' }}>
              Responda as perguntas abaixo para finalizar a análise de perfil e finalizar seu
              cadastro
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Card className="custom-card" style={{ width: isPortrait ? '90vw' : '50vw' }}>
              <Form form={form} layout="vertical">
                <div style={{ display: 'flex', flexDirection: isPortrait ? 'column' : 'row' }}>
                  <Form.Item
                    label="CPF:"
                    key="cpf"
                    name="cpf"
                    style={{
                      width: isPortrait ? '100%' : '50%',
                      marginRight: isPortrait ? 0 : '10px',
                    }}
                    rules={[{ required: true, message: 'CPF Obrigatório!' }]}
                  >
                    <NumberFormat
                      style={{
                        boxShadow: '0px 0px 3px #33333380',
                        width: '100%',
                        marginRight: '10px',
                      }}
                      className="ant-input"
                      format="###.###.###-##"
                      onValueChange={(values) => {
                        const { value } = values
                        setCPF(value)
                      }}
                    />
                  </Form.Item>
                  <div style={{ display: 'flex', flexDirection: isPortrait ? 'column' : 'row' }}>
                    <Form.Item
                      label="RG:"
                      key="rg"
                      name="rg"
                      style={{
                        width: isPortrait ? '100%' : '50%',
                        marginRight: isPortrait ? 0 : '10px',
                      }}
                      rules={[{ required: true, message: 'RG é obrigatório!' }]}
                    >
                      <Input className="custom-input" allowClear />
                    </Form.Item>
                    <Form.Item
                      label="Órgão Expedidor:"
                      key="rg_consignor"
                      name="rg_consignor"
                      style={{ width: isPortrait ? '100%' : '50%' }}
                      rules={[{ required: true, message: 'Campo obrigatório!' }]}
                    >
                      <Input className="custom-input" allowClear />
                    </Form.Item>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: isPortrait ? 'column' : 'row' }}>
                  <Form.Item
                    label="CEP:"
                    key="cep"
                    name="cep"
                    style={{
                      width: isPortrait ? '100%' : '50%',
                      marginRight: isPortrait ? 0 : '10px',
                    }}
                    rules={[{ required: true, message: 'CEP é obrigatório!' }]}
                  >
                    <Search
                      className="custom-input"
                      allowClear
                      onSearch={fillByCep}
                      enterButton="Buscar"
                      loading={searchingCep}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Estado:"
                    key="state"
                    name="state"
                    style={{ width: isPortrait ? '100%' : '50%' }}
                    rules={[{ required: true, message: 'Estado é obrigatório!' }]}
                  >
                    <Select
                      onChange={(selectedState) => onStateChange(selectedState.toString())}
                      className="custom-select"
                      placeholder="Selecione o estado"
                    >
                      {estados.map((state) => (
                        <Select.Option value={state.nome} key={state.nome}>
                          {state.nome}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div style={{ display: 'flex', flexDirection: isPortrait ? 'column' : 'row' }}>
                  <Form.Item
                    label="Cidade:"
                    key="city"
                    name="city"
                    style={{
                      width: isPortrait ? '100%' : '50%',
                      marginRight: isPortrait ? 0 : '10px',
                    }}
                    rules={[{ required: true }]}
                  >
                    <Select
                      showSearch
                      // onChange={(selectedCity) => setCity(selectedCity.toString())}
                      className="custom-select"
                      placeholder="Selecione a cidade"
                    >
                      {cities.map((cidade) => (
                        <Select.Option value={cidade} key={cidade}>
                          {cidade}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Endereço:"
                    key="address"
                    name="address"
                    style={{ width: isPortrait ? '100%' : '50%' }}
                    rules={[{ required: true }]}
                  >
                    <Input className="custom-input" allowClear />
                  </Form.Item>
                </div>
                <div style={{ display: 'flex', flexDirection: isPortrait ? 'column' : 'row' }}>
                  <Form.Item
                    label="Profissão:"
                    key="profession"
                    name="profession"
                    style={{
                      width: isPortrait ? '100%' : '50%',
                      marginRight: isPortrait ? 0 : '10px',
                    }}
                    rules={[{ required: true, message: 'Profissão é obrigatório!' }]}
                  >
                    <Input className="custom-input" allowClear />
                  </Form.Item>
                  <Form.Item
                    label="Estado Civil"
                    key="marital_status"
                    name="marital_status"
                    style={{ width: isPortrait ? '100%' : '50%' }}
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
                </div>
                <div style={{ display: 'flex', flexDirection: isPortrait ? 'column' : 'row' }}>
                  <Form.Item
                    label="Senha:"
                    key="password"
                    name="password"
                    style={{
                      width: isPortrait ? '100%' : '50%',
                      marginRight: isPortrait ? 0 : '10px',
                    }}
                    rules={[
                      { required: true, message: 'A senha é obrigatória!' },
                      { min: 8, message: 'Sua senha deve conter no mínimo 8 caracteres!' },
                    ]}
                  >
                    <Input.Password className="custom-input" allowClear />
                  </Form.Item>
                  <Form.Item
                    label="Confirmação de senha:"
                    key="confirmation"
                    name="confirmation"
                    style={{ width: isPortrait ? '100%' : '50%' }}
                    rules={[{ required: true }]}
                  >
                    <Input.Password className="custom-input" allowClear />
                  </Form.Item>
                </div>
              </Form>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <Button type="primary" style={{ width: '20vw' }} onClick={confirmHandle}>
                  CONTINUAR
                </Button>
              </div>
            </Card>
          </div>
        </PresentationLayout>
      }
    />
  )
}

export default memo(AdditionalForm)
