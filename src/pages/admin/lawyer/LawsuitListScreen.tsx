/* eslint-disable react/display-name */
import React, { memo, useState, useMemo, useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import AdminLayout from '../../GlobalLayout'
import { ResponseStatus, Lawsuit, NewLawsuit } from '~/types'
import {
  Table,
  Space,
  message,
  Select,
  Tooltip,
  Popconfirm,
  Form,
  Button,
  Input,
  Card,
  Tag,
} from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faInfo, faLink, faPlus, faEdit } from '@fortawesome/free-solid-svg-icons'
import { ColumnType } from 'antd/lib/table'
import { useForm } from 'antd/es/form/Form'

import { useStores } from '~/hooks/use-stores'

import { useHistory } from 'react-router-dom'
import { MSG_CLIENT_USER_LINKED, MSG_CLIENT_USER_LINKED_ERROR } from '~/utils/messages'
import CustomModal from '~/assets/components/CustomModal'
import { hasAdmin } from '~/utils/route-utils'
import { useMediaQuery } from 'react-responsive'
import NumberFormat from 'react-number-format'

const LawsuitListScreen = observer(() => {
  const { adminStore, authStore, lawyerStore, lawsuitStore, clientStore } = useStores()

  const history = useHistory()
  const [form] = useForm()
  const [newLawsuitForm] = useForm()
  const [editLawsuitForm] = useForm()

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [selectedLawyerId, setSelectedLawyerId] = useState<string | null>(null)
  const [selectedLawsuit, setSelectedLawsuit] = useState<Lawsuit>()
  const [lawsuits, setLawsuits] = useState<Lawsuit[]>([])
  const [newLawsuitModalState, setNewLawsuitModalState] = useState(false)
  const [editLawsuitModalState, setEditLawsuitModalState] = useState(false)

  const [linkModalState, setLinkModalState] = useState(false)
  const [infoModalState, setInfoModalState] = useState(false)

  const [filterWord, setFilterWord] = useState<string>('')

  const lawsuiTypes = ['Administrativo', 'Jurídico', 'Outros']

  const showLinkModal = useCallback(async () => {
    form.setFieldsValue({ client: '', lawyer: '' })
    setLinkModalState(true)
  }, [form])

  const setDefaults = useCallback(
    async (lawsuit: Lawsuit) => {
      editLawsuitForm.setFieldsValue({
        proc_number: lawsuit.proc_number,
        type: lawsuit.type,
        lawyer: lawsuit.lawyer?.name,
        client: lawsuit.client?.name,
        active_pole: lawsuit.active_pole,
        passive_pole: lawsuit.passive_pole,
        government_agency: lawsuit.government_agency,
        subject: lawsuit.subject,
        court_class: lawsuit.court_class,
        notice_date: lawsuit.notice_date,
        status: lawsuit.status,
      })
    },
    [editLawsuitForm],
  )

  const onSearch = useCallback(() => {
    const filterTable = lawsuitStore.allLawsuits.filter(function (lawsuit) {
      return lawsuit.proc_number.toLowerCase().includes(filterWord.toLowerCase())
    })

    setLawsuits(filterTable)
  }, [setLawsuits, filterWord, lawsuitStore.allLawsuits])

  const linkHandle = useCallback(
    async (lawsuit: Lawsuit) => {
      try {
        setSelectedLawsuit(lawsuit)
        showLinkModal()
      } catch (error) {
        console.error(error)
      }
    },
    [showLinkModal],
  )

  const infoHandle = useCallback(
    async (lawsuit: Lawsuit) => {
      try {
        setSelectedLawsuit(lawsuit)
        setInfoModalState(true)
        return
      } catch (error) {
        console.error(error)
      }
    },
    [setSelectedLawsuit],
  )

  const editHandle = useCallback(
    async (lawsuit: Lawsuit) => {
      try {
        setSelectedLawsuit(lawsuit)
        await setDefaults(lawsuit)
        setEditLawsuitModalState(true)
        return
      } catch (error) {
        console.error(error)
      }
    },
    [setSelectedLawsuit, setDefaults],
  )

  const onSave = useCallback(() => {
    editLawsuitForm.validateFields().then(async () => {
      const status = await lawsuitStore.editLawsuit(
        { ...editLawsuitForm.getFieldsValue() },
        selectedLawsuit!._id,
      )
      if (status === ResponseStatus.SUCCESS) {
        message.success('Processo atualizado com sucesso')
        await lawsuitStore.loadAllLawsuits()
        setLawsuits(lawsuitStore.allLawsuits)
        setEditLawsuitModalState(false)
        return
      } else {
        message.error('Erro ao atualizar processo!')
        return
      }
    })
  }, [editLawsuitForm, lawsuitStore, selectedLawsuit])

  const createHandler = useCallback(async () => {
    newLawsuitForm
      .validateFields()
      .then(async () => {
        const {
          proc_number,
          type,
          lawyer,
          client,
          active_pole,
          passive_pole,
          government_agency,
          subject,
          court_class,
          notice_date,
          status,
        } = newLawsuitForm.getFieldsValue()

        const lawsuit: NewLawsuit = {
          proc_number,
          type,
          lawyer,
          client,
          active_pole,
          passive_pole,
          government_agency,
          subject,
          court_class,
          notice_date,
          status,
        }

        if (lawyer === 'empty') {
          delete lawsuit.lawyer
        }

        if (client === 'empty') {
          delete lawsuit.client
        }

        const response = await lawsuitStore.createLawsuit(lawsuit)

        if (response === ResponseStatus.SUCCESS) {
          message.success('Novo processo criado com sucesso!')
          await lawsuitStore.loadAllLawsuits()
          setLawsuits(lawsuitStore.allLawsuits)
          newLawsuitForm.setFieldsValue({
            proc_number: '',
            type: '',
            lawyer: '',
            client: '',
            active_pole: '',
            passive_pole: '',
            government_agency: '',
            subject: '',
            court_class: '',
            notice_date: '',
            status: '',
          })
          setNewLawsuitModalState(false)
          return
        }

        message.error('Erro ao criar novo processo! Verifique os logs.')
      })
      .catch((error) => {
        console.error(error)
      })
  }, [lawsuitStore, newLawsuitForm, setLawsuits])

  const deleteHandler = useCallback(
    async (id: string) => {
      await adminStore.deleteLawsuit(id)
      await lawsuitStore.loadAllLawsuits()
      setLawsuits(lawsuitStore.allLawsuits)
    },
    [adminStore, setLawsuits, lawsuitStore],
  )

  const columns = useMemo(() => {
    const data: ColumnType<Lawsuit>[] = []

    data.push({
      title: isPortrait ? 'ID' : 'IDENTIFICADOR / Nº DO PROCESSO',
      dataIndex: 'proc_number',
      key: 'proc_number',
    })

    !isPortrait &&
      data.push({
        title: 'TIPO',
        dataIndex: ['type'],
        key: 'type',
        render: (_text: string, record: Lawsuit) => {
          if (record.type === 'Administrativo') {
            return <Tag color="blue">Administrativo</Tag>
          } else if (record.type === 'Jurídico') {
            return <Tag color="geekblue">Jurídico</Tag>
          } else if (record.type === 'Outros') {
            return <Tag color="orange">Outros</Tag>
          } else if (record.proc_number.replace(/\.|-/gm, '').length === 20) {
            return <Tag color="geekblue">Jurídico</Tag>
          } else {
            return <Tag color="orange">Outros</Tag>
          }
        },
      })

    !isPortrait &&
      data.push({
        title: 'CLIENTE VINCULADO',
        dataIndex: ['client', 'name'],
        key: 'name',
      })

    !isPortrait &&
      data.push({
        title: 'ADVOGADO VINCULADO',
        dataIndex: ['lawyer', 'name'],
        key: 'name',
      })

    !isPortrait &&
      data.push({
        title: 'ÚLTIMO STATUS',
        dataIndex: ['status'],
        key: 'status',
      })

    data.push({
      title: 'AÇÕES',
      key: 'actions',
      render: (_text: string, record: Lawsuit) => {
        return (
          <Space>
            {/* {hasAdmin(authStore.loggedUser) && ( */}
            <Tooltip title="Editar Processo">
              <FontAwesomeIcon
                icon={faEdit}
                onClick={() => editHandle(record)}
                style={{ cursor: 'pointer' }}
              />
            </Tooltip>
            {/* )} */}
            <Tooltip title="Vincular partes do sistema">
              <FontAwesomeIcon
                icon={faLink}
                onClick={() => linkHandle(record)}
                style={{ cursor: 'pointer' }}
              />
            </Tooltip>
            {/* )} */}
            <Tooltip title="Informações do Processo">
              <FontAwesomeIcon
                icon={faInfo}
                onClick={() => infoHandle(record)}
                style={{ cursor: 'pointer' }}
              />
            </Tooltip>
            {hasAdmin(authStore.loggedUser) && !isPortrait && (
              <Tooltip title="Deletar Processo">
                <Popconfirm
                  title="Deseja realmente deletar o processo?"
                  onConfirm={() => deleteHandler(record._id)}
                  okButtonProps={{ danger: true }}
                  okText="Excluir"
                  cancelText="Não"
                >
                  <FontAwesomeIcon icon={faTrash} style={{ cursor: 'pointer' }} />
                </Popconfirm>
              </Tooltip>
            )}
          </Space>
        )
      },
    })

    return data
  }, [deleteHandler, infoHandle, linkHandle, authStore.loggedUser, isPortrait, editHandle])

  useEffect(() => {
    async function loadLawsuits() {
      await lawsuitStore.loadAllLawsuits()
      setLawsuits(lawsuitStore.allLawsuits)
    }
    loadLawsuits()
  }, [lawsuitStore, setLawsuits])

  useEffect(() => {
    adminStore.loadClients('', true)
    adminStore.loadLawyers()
  }, [adminStore, lawsuitStore, lawyerStore.currentLawyer])

  const onSelectOk = useCallback(async () => {
    form
      .validateFields()
      .then(async () => {
        try {
          if (selectedClientId && selectedLawyerId && selectedLawsuit) {
            let response = ResponseStatus.INTERNAL_ERROR

            let lawyerId
            let clientId
            let email: string | undefined
            let name: string | undefined

            if (selectedLawyerId === 'empty') {
              lawyerId = null
            } else {
              lawyerId = selectedLawyerId
            }

            if (selectedClientId === 'empty') {
              clientId = null
            } else {
              clientId = selectedClientId
            }

            if (selectedClientId !== 'empty') {
              await clientStore.loadClientInfo(selectedClientId)
              email = clientStore.clientInfo!.email
              name = clientStore.clientInfo!.name
            } else {
              email = undefined
              name = undefined
            }

            response = await lawsuitStore.editLawsuit(
              { lawyer: lawyerId, client: clientId },
              selectedLawsuit._id,
            )

            if (response === ResponseStatus.SUCCESS) {
              message.success(MSG_CLIENT_USER_LINKED)

              if (name !== undefined && email !== undefined) {
                await lawsuitStore.sendMailNotification(
                  email,
                  name,
                  '',
                  selectedLawsuit!.proc_number,
                  '',
                  true,
                )
              }
              await lawsuitStore.loadAllLawsuits()
              setLawsuits(lawsuitStore.allLawsuits)
              setLinkModalState(false)
              return
            }

            message.error(MSG_CLIENT_USER_LINKED_ERROR)
          } else {
            message.error('Selecione ambos os campos para prosseguir com o vínculo.')
          }
        } catch (error) {
          console.error(error)
        }
      })
      .catch(() => {
        message.error('Erro ao validar dados.')
      })
  }, [
    lawsuitStore,
    selectedClientId,
    selectedLawyerId,
    selectedLawsuit,
    setLawsuits,
    clientStore,
    form,
  ])

  return (
    <div>
      <AdminLayout
        onBack={() => history.push('/admin')}
        title="PROCESSOS"
        isAdminPage
        content={
          <div>
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
                  // marginBottom: '10px',
                  marginRight: isPortrait ? 0 : '10px',
                  marginLeft: isPortrait ? 0 : '10px',
                  width: isPortrait ? '50vw' : '350px',
                  boxShadow: '0px 0px 3px #33333380',
                }}
                placeholder="Procurar por identificador..."
                enterButton
                onSearch={onSearch}
                onChange={(e) => setFilterWord(e.target.value)}
              />
              <Button
                type="primary"
                style={{
                  // marginBottom: '10px',
                  marginRight: isPortrait ? 0 : '10px',
                  marginLeft: isPortrait ? 0 : '10px',
                  width: isPortrait ? '35vw' : '100px',
                  boxShadow: '0px 0px 3px #33333380',
                }}
                onClick={() => {
                  setNewLawsuitModalState(true)
                }}
              >
                {<FontAwesomeIcon icon={faPlus} style={{ marginRight: '10px' }} />} {'NOVO'}
              </Button>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '10px',
              }}
            >
              <Table
                className="custom-table"
                columns={columns}
                rowKey="_id"
                dataSource={lawsuits}
                loading={lawsuitStore.allLawsuitsLoading}
                style={{ width: '100%', maxHeight: '80vh', overflowY: 'auto' }}
                pagination={{ style: { marginRight: '10px' } }}
              />
            </div>
          </div>
        }
      />
      <CustomModal
        visible={linkModalState}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        destroyOnClose
        onCancel={() => setLinkModalState(false)}
        title="Seleção de Cliente e Advogado"
        content={
          <div>
            <Form form={form}>
              <span style={{ color: '#04093b', fontFamily: 'Bebas Neue', fontSize: '20px' }}>
                CLIENTE:
              </span>
              <Form.Item
                key="client"
                name="client"
                rules={[{ required: true, message: 'Selecione uma opção!' }]}
              >
                <Select
                  showSearch
                  loading={adminStore.clientsLoading}
                  style={{ width: '100%' }}
                  onChange={(id) => setSelectedClientId(id.toString())}
                  className="custom-select"
                  placeholder="Cliente"
                  filterOption={(input, option) =>
                    option!.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                    option!.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Select.Option value={'empty'} key={'empty'}>
                    {'<< Sem Vínculo >>'}
                  </Select.Option>
                  {adminStore.clients.map((client) => (
                    <Select.Option value={client._id!} key={client._id!}>
                      {client.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <span style={{ color: '#04093b', fontFamily: 'Bebas Neue', fontSize: '20px' }}>
                ADVOGADO:
              </span>
              <Form.Item
                key="lawyer"
                name="lawyer"
                rules={[{ required: true, message: 'Selecione uma opção!' }]}
              >
                <Select
                  showSearch
                  loading={adminStore.lawyersLoading}
                  style={{ width: '100%' }}
                  onChange={(id) => setSelectedLawyerId(id.toString())}
                  className="custom-select"
                  placeholder="Advogado"
                  value={''}
                  filterOption={(input, option) =>
                    option!.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                    option!.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Select.Option value={'empty'} key={'empty'}>
                    {'<< Sem Vínculo >>'}
                  </Select.Option>
                  {adminStore.lawyers.map((lawyer) => (
                    <Select.Option value={lawyer._id!} key={lawyer._id!}>
                      {lawyer.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5px' }}>
                <Form.Item key="savebutton" name="savebutton">
                  <Button type="primary" style={{ margin: '10px' }} onClick={onSelectOk}>
                    SALVAR
                  </Button>
                </Form.Item>
                <Form.Item key="cancel" name="cancel">
                  <Button
                    type="default"
                    style={{ margin: '10px' }}
                    onClick={() => setLinkModalState(false)}
                  >
                    CANCELAR
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        }
      />
      <CustomModal
        visible={newLawsuitModalState}
        okButtonProps={{ style: { display: 'none' } }}
        cancelButtonProps={{ style: { display: 'none' } }}
        destroyOnClose
        onOk={() => setNewLawsuitModalState(false)}
        onCancel={() => setNewLawsuitModalState(false)}
        width={isPortrait ? '95vw' : '50%'}
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
                  NOVO PROCESSO
                </span>
              }
              style={{
                width: isPortrait ? '90vw' : '80vw',
                marginRight: '10px',
                height: '60vh',
                overflowY: 'auto',
              }}
            >
              <Form form={newLawsuitForm} layout="vertical">
                <Form.Item
                  name="proc_number"
                  key="proc_number"
                  label="Identificador do Processo (Número, nome ou código):"
                  rules={[{ required: true }]}
                >
                  <Input allowClear className="custom-input" />
                </Form.Item>
                <Form.Item
                  name="type"
                  key="type"
                  label="Tipo do processo:"
                  rules={[{ required: true }]}
                >
                  <Select showSearch className="custom-select">
                    {lawsuiTypes.map((type) => (
                      <Select.Option value={type} key={type}>
                        {type}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  key="lawyer"
                  name="lawyer"
                  label="Vincular Advogado:"
                  rules={[{ required: true, message: 'Selecione uma opção!' }]}
                >
                  <Select
                    showSearch
                    loading={adminStore.lawyersLoading}
                    style={{ width: '100%' }}
                    onChange={(id) => setSelectedLawyerId(id.toString())}
                    className="custom-select"
                    placeholder="Advogado"
                    value={''}
                    filterOption={(input, option) =>
                      option!.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                      option!.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Select.Option value={'empty'} key={'empty'}>
                      {'<< Sem Vínculo >>'}
                    </Select.Option>
                    {adminStore.lawyers.map((lawyer) => (
                      <Select.Option value={lawyer._id!} key={lawyer._id!}>
                        {lawyer.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  key="client"
                  name="client"
                  label="Vincular Cliente:"
                  rules={[{ required: true, message: 'Selecione uma opção!' }]}
                >
                  <Select
                    showSearch
                    loading={adminStore.clientsLoading}
                    style={{ width: '100%' }}
                    onChange={(id) => setSelectedClientId(id.toString())}
                    className="custom-select"
                    placeholder="Cliente"
                    filterOption={(input, option) =>
                      option!.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                      option!.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Select.Option value={'empty'} key={'empty'}>
                      {'<< Sem Vínculo >>'}
                    </Select.Option>
                    {adminStore.clients.map((client) => (
                      <Select.Option value={client._id} key={client._id!}>
                        {client.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="active_pole" key="active-pole" label="Pólo Ativo:">
                  <Input className="custom-input" />
                </Form.Item>
                <Form.Item name="passive_pole" key="passive-pole" label="Pólo Passivo:">
                  <Input className="custom-input" />
                </Form.Item>
                <Form.Item
                  name="government_agency"
                  key="government_agency"
                  label="Órgão Governamental:"
                >
                  <Input className="custom-input" />
                </Form.Item>
                <Form.Item name="subject" key="subject" label="Assunto:">
                  <Input className="custom-input" />
                </Form.Item>
                <Form.Item name="court_class" key="court_class" label="Classe Judicial:">
                  <Input className="custom-input" />
                </Form.Item>
                <Form.Item
                  name="notice_date"
                  key="notice_date"
                  label="Data de Autuação:"
                  style={{ marginRight: '10px', width: isPortrait ? '100%' : '100%' }}
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
                <Form.Item name="status" key="status" label="Status:">
                  <Input className="custom-input" />
                </Form.Item>
              </Form>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button
                  type="primary"
                  style={{ width: isPortrait ? '30vw' : '20vw' }}
                  onClick={() => createHandler()}
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
        visible={editLawsuitModalState}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        destroyOnClose
        onOk={() => setEditLawsuitModalState(false)}
        onCancel={() => setEditLawsuitModalState(false)}
        width={isPortrait ? '95vw' : '50%'}
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
                  EDITAR PROCESSO - {selectedLawsuit?.proc_number}
                </span>
              }
              style={{
                width: isPortrait ? '90vw' : '80vw',
                marginRight: '10px',
                height: '60vh',
                overflowY: 'auto',
              }}
            >
              <Form form={editLawsuitForm} layout="vertical">
                <Form.Item
                  name="proc_number"
                  key="proc_number"
                  label="Identificador do Processo (Número, nome ou código):"
                  rules={[{ required: true }]}
                >
                  <Input allowClear className="custom-input" />
                </Form.Item>
                <Form.Item
                  name="type"
                  key="type"
                  label="Tipo do processo:"
                  rules={[{ required: true }]}
                >
                  <Select showSearch className="custom-select">
                    {lawsuiTypes.map((type) => (
                      <Select.Option value={type} key={type}>
                        {type}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="active_pole" key="active-pole" label="Pólo Ativo:">
                  <Input className="custom-input" />
                </Form.Item>
                <Form.Item name="passive_pole" key="passive-pole" label="Pólo Passivo:">
                  <Input className="custom-input" />
                </Form.Item>
                <Form.Item
                  name="government_agency"
                  key="government_agency"
                  label="Órgão Governamental:"
                >
                  <Input className="custom-input" />
                </Form.Item>
                <Form.Item name="subject" key="subject" label="Assunto:">
                  <Input className="custom-input" />
                </Form.Item>
                <Form.Item name="court_class" key="court_class" label="Classe Judicial:">
                  <Input className="custom-input" />
                </Form.Item>
                <Form.Item
                  name="notice_date"
                  key="notice_date"
                  label="Data de Autuação:"
                  style={{ marginRight: '10px', width: isPortrait ? '100%' : '100%' }}
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
                <Form.Item name="status" key="status" label="Status:">
                  <Input className="custom-input" />
                </Form.Item>
              </Form>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button
                  type="primary"
                  style={{ width: isPortrait ? '30vw' : '20vw' }}
                  onClick={() => onSave()}
                  loading={lawsuitStore.editLawsuitsLoading}
                >
                  SALVAR
                </Button>
              </div>
            </Card>
          </div>
        }
      />
      {selectedLawsuit && (
        <CustomModal
          visible={infoModalState}
          onCancel={() => setInfoModalState(false)}
          destroyOnClose
          title="Informações do Processo"
          onOk={() => setInfoModalState(false)}
          cancelButtonProps={{ style: { display: 'none' } }}
          content={
            <div>
              <span style={{ fontWeight: 'bold' }}>{`ID/CÓDIGO: ${
                selectedLawsuit!.proc_number
              }`}</span>
              <br></br>
              <span>AUTUAÇÃO: {selectedLawsuit.notice_date}</span>
              <br></br>
              <span>PÓLO ATIVO: {selectedLawsuit.active_pole}</span>
              <br></br>
              <span>PÓLO PASSIVO: {selectedLawsuit.passive_pole}</span>
              <br></br>
              <span>ÓRGÃO GOVERNAMENTAL: {selectedLawsuit.government_agency}</span>
              <br></br>
              <span>-----------</span>
              <br></br>
              <span>
                <b>STATUS:</b> {selectedLawsuit.status}
              </span>
            </div>
          }
        />
      )}
    </div>
  )
})

export default memo(LawsuitListScreen)
