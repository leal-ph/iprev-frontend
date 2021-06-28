/* eslint-disable react/display-name */
import React, { memo, useState, useMemo, useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import AdminLayout from '../../GlobalLayout'
import { Client, NewClient, ResponseStatus, Profile } from '~/types'
import {
  Table,
  Space,
  Card,
  message,
  Tooltip,
  Popconfirm,
  Tag,
  Form,
  Input,
  Button,
  List,
  Typography,
  Select,
} from 'antd'
import NumberFormat from 'react-number-format'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEdit,
  faTrash,
  faTimes,
  faPlus,
  faCheckCircle,
  faInfoCircle,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { ColumnType } from 'antd/lib/table'
import CustomModal from '~/assets/components/CustomModal'
import { MSG_UPDATE_USER_SUCCESS, MSG_UPDATE_USER_ERROR } from '~/utils/messages'
import { Payment } from '~/types'

import { useStores } from '~/hooks/use-stores'

import { useHistory } from 'react-router-dom'
import { MSG_CLIENT_NOT_FOUND, MSG_PASSWORD_NOT_MATCH } from '~/utils/messages'
import { hasAdmin } from '~/utils/route-utils'
// import { checkPendingDocuments } from '~/utils/document-utils'
import { useMediaQuery } from 'react-responsive'
import cep from 'cep-promise'
import { cpf } from 'cpf-cnpj-validator'
import { estados } from '~/utils/estados-cidades.json'

const ClientListScreen = observer(() => {
  const { adminStore, authStore, lawyerStore, clientStore, profileStore } = useStores()

  const maritals = [
    'Solteiro (a)',
    'Casado (a)',
    'Viúvo (a)',
    'Separado (a) judicialmente',
    'Divorciado (a)',
    'Estado Civil não informado',
  ]

  const history = useHistory()
  const [form] = Form.useForm()
  const [newUserForm] = Form.useForm()

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  const [profileFilters] = useState<any[]>([])
  const [CPF, setCPF] = useState('')
  const [newClientModalState, setNewClientModalState] = useState(false)
  const [editModalState, setEditModalState] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [filterWord, setFilterWord] = useState<string>('')
  const [searchingCep, setSearchingCep] = useState(false)
  const [cities, setCities] = useState<string[]>([])

  const { Search } = Input

  const fillByCep = useCallback(async () => {
    const cepForm = newUserForm.getFieldValue('zipcode')

    try {
      setSearchingCep(true)
      const cepInfo = await cep(cepForm)
      setSearchingCep(false)
      if (cepInfo) {
        const parsedState = estados.filter((estado) => estado.sigla === cepInfo.state)
        // setState(parsedState[0].nome)

        newUserForm.setFieldsValue({
          city: cepInfo.city,
          state: parsedState[0].nome,
          address: cepInfo.street,
        })
      }
    } catch (err) {
      console.error(err)
      message.error('CEP Inválido!')
      setSearchingCep(false)
      return
    }
  }, [newUserForm])

  const onStateChange = useCallback(
    async (selectedState: string) => {
      const filterCity = estados.filter((estado) => estado.nome === selectedState)

      setCities(filterCity[0].cidades)
    },
    [setCities],
  )

  const newUserHandle = useCallback(() => {
    newUserForm
      .validateFields()
      .then(async () => {
        const {
          name,
          camefrom,
          birthdate,
          number,
          profile,
          email,
          state,
          rg,
          rg_consignor,
          zipcode,
          city,
          address,
          profession,
          marital_status,
          password,
          confirmation,
        } = newUserForm.getFieldsValue()

        const newClient: NewClient = {
          name,
          camefrom,
          birthdate,
          telephone: number,
          profile,
          cpf: CPF,
          email,
          rg,
          rg_consignor,
          zipcode,
          state,
          city,
          address,
          profession,
          marital_status,
          finished: true,
        }

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

        const response = await clientStore.createNewClient(newClient, password)

        if (response === ResponseStatus.SUCCESS) {
          message.success('Cliente cadastrado com sucesso!')
          if (lawyerStore.currentLawyer && lawyerStore.currentLawyer._id) {
            await adminStore.loadClients(
              lawyerStore.currentLawyer._id,
              hasAdmin(authStore.loggedUser),
            )
            setClients(adminStore.clients)
            setNewClientModalState(false)
          }
        } else if (response === ResponseStatus.DUPLICATE_REGISTER) {
          message.error(
            'E-Mail já cadastrado no sistema. Informe o escritório caso este e-mail seja seu e nunca tenha feito o cadastro.',
          )
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }, [CPF, clientStore, newUserForm, adminStore, authStore.loggedUser, lawyerStore.currentLawyer])

  const infoHandle = useCallback(
    async (_id: string, e: React.MouseEvent) => {
      e.stopPropagation()
      try {
        const response = await adminStore.loadSelectedClient(_id)
        if (response === ResponseStatus.SUCCESS) {
          history.push('/admin/clients/info')
          return
        }
        message.error(MSG_CLIENT_NOT_FOUND)
      } catch (error) {
        console.error(error)
      }
    },
    [adminStore, history],
  )

  const detailsHandle = useCallback(
    async (_id: string) => {
      try {
        const response = await adminStore.loadSelectedClient(_id)
        if (response === ResponseStatus.SUCCESS) {
          return
        }
        message.error(MSG_CLIENT_NOT_FOUND)
      } catch (error) {
        console.error(error)
      }
    },
    [adminStore],
  )

  const setDefaults = useCallback(() => {
    if (adminStore.selectedClient) {
      form.setFieldsValue({
        name: adminStore.selectedClient.name,
        birthdate: adminStore.selectedClient.birthdate,
        number: adminStore.selectedClient.telephone,
        profile: adminStore.selectedClient.profile.title,
        cpf: adminStore.selectedClient.cpf,
        rg: adminStore.selectedClient.rg,
        camefrom: adminStore.selectedClient.camefrom,
        zipcode: adminStore.selectedClient.zipcode,
        city: adminStore.selectedClient.city,
        address: adminStore.selectedClient.address,
        state: adminStore.selectedClient.state,
        profession: adminStore.selectedClient.profession,
        marital_status: adminStore.selectedClient.marital_status,
        rg_consignor: adminStore.selectedClient.rg_consignor,
        email: adminStore.selectedClient.email,
      })
    }
  }, [adminStore.selectedClient, form])

  const editHandler = useCallback(
    async (_id: string, e: React.MouseEvent) => {
      e.stopPropagation()
      try {
        const response = await adminStore.loadSelectedClient(_id)
        if (response === ResponseStatus.SUCCESS) {
          setDefaults()
          setEditModalState(true)
          // history.push('/admin/clients/info')
          return
        }
        message.error(MSG_CLIENT_NOT_FOUND)
      } catch (error) {
        console.error(error)
      }
    },
    [adminStore, setDefaults],
  )

  const onEdit = useCallback(() => {
    form.validateFields().then(async () => {
      if (adminStore.selectedClient) {
        const status = await clientStore.editUser(
          { ...form.getFieldsValue(), profile: adminStore.selectedClient.profile._id },
          adminStore.selectedClient._id,
        )
        if (status === ResponseStatus.SUCCESS) {
          message.success(MSG_UPDATE_USER_SUCCESS)
          if (lawyerStore.currentLawyer && lawyerStore.currentLawyer._id) {
            adminStore.loadClients(lawyerStore.currentLawyer._id, hasAdmin(authStore.loggedUser))
            setClients(adminStore.clients)
            setEditModalState(false)
          }
          return
        }

        message.error(MSG_UPDATE_USER_ERROR)
      }
    })
  }, [form, clientStore, adminStore, authStore.loggedUser, lawyerStore.currentLawyer])

  const deleteHandler = useCallback(
    async (_id: string, e: React.MouseEvent) => {
      e.stopPropagation()
      await adminStore.deleteClient(_id)
      if (lawyerStore.currentLawyer && lawyerStore.currentLawyer._id) {
        await adminStore.loadClients(lawyerStore.currentLawyer._id, hasAdmin(authStore.loggedUser))
        setClients(adminStore.clients)
      }
    },
    [adminStore, authStore.loggedUser, lawyerStore.currentLawyer],
  )

  const checkPayments = useCallback((client: Client): number => {
    let openCounter = 0
    let pendingCounter = 0
    const now = new Date()

    client.payments.forEach(async (payment) => {
      if (
        (payment.status === 'pending' || payment.status === 'placeholder') &&
        new Date(payment.expiry_date!) < new Date(now) &&
        payment.charge_identification !== 'HONORÁRIOS'
      ) {
        pendingCounter = pendingCounter + 1
      }
      if (
        (payment.status === 'pending' || payment.status === 'placeholder') &&
        new Date(payment.expiry_date!) > new Date(now) &&
        payment.charge_identification !== 'HONORÁRIOS'
      ) {
        openCounter = openCounter + 1
      }
    })

    if (pendingCounter > 0) {
      return 0
    }
    if (openCounter > 0) {
      return 1
    } else {
      return 2
    }
  }, [])

  const checkPaymentStatus = useCallback((payment: Payment) => {
    const now = new Date()

    if (
      (payment.status === 'pending' || payment.status === 'placeholder') &&
      new Date(payment.expiry_date!) < new Date(now)
    ) {
      return <Tag color="red">Expirado</Tag>
    }
    if (
      (payment.status === 'pending' || payment.status === 'placeholder') &&
      new Date(payment.expiry_date!) > new Date(now)
    ) {
      return <Tag color="blue">Em Aberto</Tag>
    }
    if (payment.status === 'paid') {
      return <Tag color="green">Pago</Tag>
    }
  }, [])

  const onSelectChange = useCallback(
    (keys: string[]) => {
      if (!selectedRowKeys.includes(keys[0])) {
        setSelectedRowKeys(keys)
        detailsHandle(keys[0])
      } else {
        setSelectedRowKeys([])
      }
    },
    [setSelectedRowKeys, selectedRowKeys, detailsHandle],
  )

  const columns = useMemo(() => {
    const data: ColumnType<Client>[] = []

    data.push({
      title: () => <span className="custom-tab-title">Nome</span>,
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Client, b: Client) => a.name.localeCompare(b.name),
    })

    !isPortrait &&
      data.push({
        title: () => <span className="custom-tab-title">Pagamento</span>,
        key: 'payment',
        sorter: (a: Client, b: Client) => checkPayments(a) - checkPayments(b),
        render: (_text: string, record: Client) => {
          const checkpayment = checkPayments(record)

          if (checkpayment === 1) {
            return <Tag color="blue">Em aberto</Tag>
          }
          if (checkpayment === 2) {
            return <Tag color="green">Em dia</Tag>
          }
          if (checkpayment === 0) {
            return <Tag color="red">Inadimplente</Tag>
          }
        },
      })

    data.push({
      title: () => <span className="custom-tab-title">Ações</span>,
      key: 'actions',
      render: (_text: string, record: Client) => {
        return (
          <Space>
            {/* {hasAdmin(authStore.loggedUser) && (
              <Tooltip title="Selecionar Advogado">
                <FontAwesomeIcon
                  icon={faLink}
                  onClick={() => linkHandle(record._id)}
                  style={{ cursor: 'pointer' }}
                />
              </Tooltip>
            )} */}
            <Tooltip title="Informações do Cliente">
              <FontAwesomeIcon
                icon={faInfoCircle}
                onClick={(e) => infoHandle(record._id, e)}
                style={{ cursor: 'pointer' }}
              />
            </Tooltip>
            <Tooltip title="Editar Cliente">
              <FontAwesomeIcon
                icon={faEdit}
                onClick={(e) => editHandler(record._id, e)}
                style={{ cursor: 'pointer' }}
              />
            </Tooltip>
            {hasAdmin(authStore.loggedUser) && (
              <Tooltip title="Deletar Cliente">
                <Popconfirm
                  title="Deseja realmente deletar o cliente?"
                  onConfirm={(e) => deleteHandler(record._id, e!)}
                  onCancel={(e) => e?.stopPropagation()}
                  okButtonProps={{ danger: true }}
                  okText="Excluir"
                  cancelText="Não"
                >
                  <FontAwesomeIcon
                    icon={faTrash}
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Popconfirm>
              </Tooltip>
            )}
          </Space>
        )
      },
    })

    return data
  }, [
    checkPayments,
    deleteHandler,
    editHandler,
    infoHandle,
    profileFilters,
    authStore.loggedUser,
    isPortrait,
  ])

  useEffect(() => {
    if (authStore.loggedUser) {
      lawyerStore.loadLawyer(authStore.loggedUser._id)
    }
  }, [authStore.loggedUser, lawyerStore])

  useEffect(() => {
    async function loadClients() {
      if (lawyerStore.currentLawyer && lawyerStore.currentLawyer._id) {
        // *** Descomentar para aplicar a limitação de visualização de todos os clientes apenas para admin ***
        // adminStore.loadClients(lawyerStore.currentLawyer._id, hasAdmin(authStore.loggedUser))
        await adminStore.loadClients(lawyerStore.currentLawyer._id, true)
        await profileStore.loadAll()
        setClients(adminStore.clients)
        setProfiles(profileStore.profiles)
      }
    }
    loadClients()
  }, [adminStore, lawyerStore.currentLawyer, authStore.loggedUser, setClients, profileStore])

  const onSearch = useCallback(() => {
    const filterTable = adminStore.clients.filter(function (client) {
      return client.name.toLowerCase().includes(filterWord.toLowerCase())
    })

    setClients(filterTable)
  }, [adminStore.clients, setClients, filterWord])

  return (
    <div>
      <AdminLayout
        onBack={() => history.push('/admin')}
        title="Associados"
        isAdminPage
        content={
          <div style={{ marginTop: '15px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: isPortrait ? 'center' : 'space-between',
                alignItems: 'center',
                flexDirection: isPortrait ? 'column' : 'row',
              }}
            >
              <Input.Search
                style={{
                  marginBottom: '10px',
                  marginLeft: isPortrait ? 0 : '2.5vw',
                  width: isPortrait ? '50vw' : '350px',
                  boxShadow: '0px 0px 3px #33333380',
                }}
                placeholder="Procurar por nome..."
                enterButton
                onSearch={onSearch}
                onChange={(e) => setFilterWord(e.target.value)}
              />

              {selectedRowKeys.length === 0 && (
                <Button
                  type="primary"
                  style={{
                    marginBottom: '10px',
                    marginRight: isPortrait ? 0 : '2.5vw',
                    marginLeft: isPortrait ? 0 : '10px',
                    width: '120px',
                    boxShadow: '0px 0px 3px #33333380',
                  }}
                  onClick={() => {
                    setNewClientModalState(true)
                  }}
                >
                  <p
                    style={{
                      color: '#fff',
                      fontFamily: 'Lato',
                    }}
                  >
                    {<FontAwesomeIcon icon={faPlus} style={{ marginRight: '10px' }} />} {'NOVO'}
                  </p>
                </Button>
              )}
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: isPortrait ? 'center' : 'flex-start',
                flexDirection: isPortrait ? 'column' : 'row',
              }}
            >
              <Table
                className="custom-table"
                pagination={{ style: { marginRight: '10px' } }}
                columns={columns}
                rowKey="_id"
                dataSource={clients}
                loading={adminStore.clientsLoading}
                onRow={(row) => {
                  return {
                    onClick: () => {
                      onSelectChange([row._id])
                    },
                  }
                }}
                // TODO: Verificar como ficará com uma grande quantidade de dados.
                style={{
                  width: isPortrait ? '90vw' : '95%',
                  marginBottom: '10px',
                  marginRight: isPortrait ? 0 : '10px',
                  marginLeft: isPortrait ? 0 : '10px',
                }}
              />
              {selectedRowKeys.length > 0 && (
                // TODO: Ajustar o Layout
                // TODO: Preencher Informações do Cliente
                <Card
                  className="custom-card"
                  title={`DETALHE DO CLIENTE: ${adminStore.selectedClient?.name.toUpperCase()}`}
                  style={{
                    marginBottom: '10px',
                    width: isPortrait ? '90vw' : '30vw',
                    marginRight: isPortrait ? 0 : '10px',
                  }}
                >
                  <List
                    locale={{ emptyText: 'NÃO EXISTEM PAGAMENTOS REGISTRADOS' }}
                    size="small"
                    header={
                      <div>
                        <FontAwesomeIcon icon={faCheckCircle} color="green" />
                        <span style={{ color: '#04093b', marginLeft: '10px' }}>
                          <b>PAGAMENTOS REALIZADOS:</b>
                        </span>
                      </div>
                    }
                    style={{ marginBottom: '10px' }}
                    bordered
                    dataSource={adminStore.selectedClient?.payments
                      .filter((payment) => payment.status === 'paid')
                      .map((payment) => (
                        <div key="paymentdetails">
                          <Typography>
                            <b>Descrição:</b> {payment.charge_identification}
                          </Typography>
                          <Typography>
                            <b>Valor:</b> R${' '}
                            {(payment.item.price_cents / 100).toLocaleString('pt-BR')}
                          </Typography>
                          <Typography>
                            <b>Status:</b> {checkPaymentStatus(payment)}
                          </Typography>
                        </div>
                      ))}
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                  />{' '}
                  <List
                    size="small"
                    locale={{ emptyText: 'NÃO EXISTEM PAGAMENTOS REGISTRADOS' }}
                    header={
                      <div>
                        <FontAwesomeIcon icon={faTimes} color="red" />
                        <span style={{ color: '#04093b', marginLeft: '10px' }}>
                          <b>PAGAMENTOS PENDENTES:</b>
                        </span>
                      </div>
                    }
                    bordered
                    style={{ marginBottom: '10px' }}
                    dataSource={adminStore.selectedClient?.payments
                      .filter((payment) => payment.status === 'placeholder')
                      .map((payment) => (
                        <div key="paymentdetails">
                          <Typography>
                            <b>Descrição:</b> {payment.charge_identification}
                          </Typography>
                          <Typography>
                            <b>Valor:</b> R${' '}
                            {(payment.item.price_cents / 100).toLocaleString('pt-BR')}
                          </Typography>
                          <Typography>
                            <b>Status:</b> {checkPaymentStatus(payment)}
                          </Typography>
                        </div>
                      ))}
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                  />
                </Card>
              )}
            </div>
          </div>
        }
      />
      <CustomModal
        visible={editModalState}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        destroyOnClose
        title="Editar Cliente"
        onOk={() => setEditModalState(false)}
        onCancel={() => setEditModalState(false)}
        // width="50%"
        content={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Card
              className="custom-card"
              title="DADOS DO CLIENTE"
              style={{
                width: isPortrait ? '90vw' : '50vw',
                marginRight: '10px',
                height: '60vh',
                overflowY: 'auto',
              }}
            >
              <Form form={form} layout="vertical">
                <Form.Item
                  name="name"
                  key="name"
                  label="Nome Completo:"
                  rules={[{ required: true }]}
                >
                  <Input allowClear className="custom-input" />
                </Form.Item>
                <Form.Item name="camefrom" key="camefrom" label="Procedência:">
                  <Select className="custom-select">
                    {['IPREV', 'Site', 'Redes Sociais'].map((option) => (
                      <Select.Option key={option} value={option}>{`${option}`}</Select.Option>
                    ))}
                  </Select>
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
                <Form.Item name="rg_consignor" key="rg_consignor" label="Órgão Expedidor:">
                  <Input className="custom-input" />
                </Form.Item>
                <Form.Item name="zipcode" key="zipcode" label="CEP:" rules={[{ required: true }]}>
                  <Input className="custom-input" />
                </Form.Item>
                <Form.Item name="state" key="state" label="Estado:" rules={[{ required: true }]}>
                  <Input className="custom-input" />
                </Form.Item>

                <Form.Item name="city" key="city" label="Cidade:" rules={[{ required: true }]}>
                  <Input className="custom-input" />
                </Form.Item>
                <Form.Item
                  name="address"
                  key="address"
                  label="Endereço:"
                  rules={[{ required: true }]}
                >
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
              </Form>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button
                  type="primary"
                  style={{ width: isPortrait ? '30vw' : '20vw' }}
                  onClick={onEdit}
                  loading={clientStore.saveLoading}
                >
                  SALVAR
                </Button>
              </div>
            </Card>
          </div>
        }
      />
      <CustomModal
        visible={newClientModalState}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        destroyOnClose
        title={
          <span style={{ color: '#04093b', fontFamily: 'Bebas Neue', fontSize: '20px' }}>
            {<FontAwesomeIcon icon={faUser} style={{ marginRight: '10px' }} />}{' '}
            {'CADASTRAR CLIENTE'}
          </span>
        }
        onOk={() => setNewClientModalState(false)}
        onCancel={() => setNewClientModalState(false)}
        width={isPortrait ? '95%' : '50%'}
        content={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Card
              className="custom-card"
              title={
                <span style={{ color: '#04093b', fontFamily: 'Bebas Neue', fontSize: '20px' }}>
                  {<FontAwesomeIcon icon={faEdit} style={{ marginRight: '10px' }} />}{' '}
                  {'DADOS DO CLIENTE'}
                </span>
              }
              style={{
                width: isPortrait ? '90vw' : '50vw',
                marginRight: '10px',
                height: '60vh',
                overflowY: 'auto',
              }}
            >
              <Form form={newUserForm} layout="vertical">
                <Form.Item
                  name="name"
                  key="name"
                  label="Nome Completo:"
                  rules={[{ required: true }]}
                >
                  <Input allowClear className="custom-input" />
                </Form.Item>
                <Form.Item name="camefrom" key="camefrom" label="Procedência:">
                  <Select className="custom-select">
                    {['IPREV', 'Site', 'Redes Sociais'].map((option) => (
                      <Select.Option key={option} value={option}>{`${option}`}</Select.Option>
                    ))}
                  </Select>
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
                  <Select className="custom-select" placeholder="Selecione o perfil">
                    {profiles.map((profile) => (
                      <Select.Option value={profile._id} key={profile.title}>
                        {profile.title}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="clientCPF"
                  key="clientCPF"
                  label="CPF:"
                  rules={[{ required: true }]}
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
                <Form.Item name="rg_consignor" key="rg_consignor" label="Órgão Expedidor:">
                  <Input className="custom-input" />
                </Form.Item>
                <Form.Item
                  label="CEP:"
                  key="zipcode"
                  name="zipcode"
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
                <Form.Item label="Cidade:" key="city" name="city" rules={[{ required: true }]}>
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
                  rules={[{ required: true }]}
                >
                  <Input className="custom-input" allowClear />
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
                  label="Senha:"
                  key="password"
                  name="password"
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
                  rules={[{ required: true }]}
                >
                  <Input.Password className="custom-input" allowClear />
                </Form.Item>
              </Form>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button
                  type="primary"
                  style={{ width: isPortrait ? '30vw' : '20vw' }}
                  onClick={newUserHandle}
                  loading={clientStore.saveLoading}
                >
                  SALVAR
                </Button>
              </div>
            </Card>
          </div>
        }
      />
      {/* <CustomModal
        visible={modalState}
        onCancel={() => setModalState(false)}
        destroyOnClose
        title="Seleção de Advogado"
        onOk={onSelectLawyer}
        content={
          <Select
            loading={adminStore.lawyersLoading}
            style={{ width: '100%' }}
            onChange={(id) => setSelectedLawyerId(id.toString())}
            className="custom-select"
          >
            {adminStore.lawyers.map((lawyer) => (
              <Select.Option value={lawyer._id!} key={lawyer._id!}>
                {lawyer.name}
              </Select.Option>
            ))}
          </Select>
        }
      /> */}
    </div>
  )
})

export default memo(ClientListScreen)
