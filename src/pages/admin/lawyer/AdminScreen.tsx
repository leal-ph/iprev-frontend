/* eslint-disable react/display-name */
import React, { memo, useState, useMemo, useCallback, useEffect } from 'react'
import AdminLayout from '../../GlobalLayout'
import { Lawyer } from '~/types'
import {
  Table,
  Layout,
  Card,
  Button,
  Form,
  Input,
  message,
  Select,
  Checkbox,
  Tooltip,
  Popconfirm,
} from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faUndo, faLock } from '@fortawesome/free-solid-svg-icons'
import { ColumnType } from 'antd/lib/table'
import { RowSelectionType } from 'antd/lib/table/interface'
import NumberFormat from 'react-number-format'

import { useStores } from '~/hooks/use-stores'
import { ResponseStatus } from '~/types'
import { useHistory } from 'react-router-dom'
import {
  MSG_LAWYER_CREATED,
  MSG_LAWYER_CREATED_FAILED,
  MSG_LAWYER_UPDATED,
  MSG_PASSWORD_NOT_MATCH,
} from '~/utils/messages'
import { observer } from 'mobx-react-lite'
import { useMediaQuery } from 'react-responsive'
import { titleStyle } from '../../styles'

const { Content } = Layout

const AdminScreen = observer(() => {
  const { adminStore, msgraphStore, groupStore } = useStores()

  const history = useHistory()

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  const [form] = Form.useForm()

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer>()
  const [editable, setEditable] = useState(false)
  const [newEnable, setNewEnable] = useState(true)
  const [newButtonText, setNewButtonText] = useState('NOVO')
  const [newUser, setNewUser] = useState(false)
  const [createAdmin, setCreateAdmin] = useState(false)
  const [lastPassReseted, setLastPassReseted] = useState(' - ')

  const createHandle = useCallback(() => {
    form
      .validateFields()
      .then(async () => {
        const {
          name,
          number,
          birthdate,
          email,
          groupId,
          password,
          confirmation,
          teamsId,
        } = form.getFieldsValue()

        if (password !== confirmation) {
          message.error(MSG_PASSWORD_NOT_MATCH)
          return
        }

        const sep_name = name.split(' ')

        if (sep_name.length < 2) {
          message.error('Insira o nome completo do advogado!')
          return
        }

        const lawyer: Lawyer = {
          name: name,
          lastname: sep_name[1],
          email,
          group: groupId,
          birthdate: birthdate,
          telephone: number,
          super_admin: false,
          teamsuserID: teamsId,
        }

        const response = await adminStore.registerLawyer(lawyer, password, createAdmin)

        if (response === ResponseStatus.SUCCESS) {
          message.success(MSG_LAWYER_CREATED)
          adminStore.loadLawyers()
          form.setFieldsValue({
            name: '',
            birthdate: '',
            number: '',
            email: '',
            groupId: '',
            teamsId: '',
            password: '',
            confirmation: '',
          })
          return
        }

        message.error(MSG_LAWYER_CREATED_FAILED)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [form, adminStore, createAdmin])

  const updateHandle = useCallback(() => {
    form
      .validateFields()
      .then(async () => {
        const {
          name,
          number,
          email,
          birthdate,
          groupId,
          password,
          confirmation,
          teamsId,
        } = form.getFieldsValue()

        if (password !== confirmation) {
          message.error(MSG_PASSWORD_NOT_MATCH)
          return
        }

        const sep_name = name.split(' ')

        const lawyer: Lawyer = {
          name: name,
          lastname: sep_name[1],
          email,
          group: groupId,
          birthdate: birthdate,
          telephone: number,
          super_admin: false,
          teamsuserID: teamsId,
        }

        const selectedLawyerId = selectedRowKeys[selectedRowKeys.length - 1]

        if (selectedLawyerId) {
          const response = await adminStore.updateLawyer(lawyer, selectedLawyerId)
          if (response === ResponseStatus.SUCCESS) {
            message.success(MSG_LAWYER_UPDATED)
            adminStore.loadLawyers()
            setEditable(false)

            return
          }
          message.error(MSG_LAWYER_CREATED_FAILED)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }, [form, adminStore, selectedRowKeys])

  const deleteHandler = useCallback(async () => {
    if (selectedLawyer && selectedLawyer._id) {
      const response = await adminStore.deleteLawyer(selectedLawyer._id)
      if (response === ResponseStatus.SUCCESS) {
        message.success('Removido com sucesso!')
        adminStore.loadLawyers()
        setSelectedRowKeys([])
        form.setFieldsValue({
          name: '',
          birthdate: '',
          number: '',
          email: '',
          groupId: '',
          teamsId: '',
          password: '',
          confirmation: '',
        })
      }
    }
  }, [adminStore, selectedLawyer, setSelectedRowKeys, form])

  const changeButtonText = useCallback(
    async (editable: boolean) => {
      if (editable) {
        setNewButtonText('CANCELAR ')
      } else {
        setNewButtonText('NOVO ')
      }
    },
    [setNewButtonText],
  )

  const onSelectChange = useCallback(
    (keys) => {
      if (keys) {
        const value = keys[keys.length - 1]
        if (value) {
          setSelectedRowKeys([value])
          setNewEnable(false)
          setEditable(false)
          setNewUser(false)
          setNewButtonText('NOVO')
        } else {
          setNewEnable(true)
          setSelectedRowKeys([])
          setEditable(false)
        }
      }
    },
    [setSelectedRowKeys, setNewEnable],
  )

  const onResetPass = useCallback(async () => {
    if (selectedLawyer?.user && selectedLawyer._id) {
      const response = await adminStore.resetLawyerPassword(
        selectedLawyer?.user,
        selectedLawyer._id,
      )

      if (response === ResponseStatus.SUCCESS) {
        message.success('Senha resetada com sucesso!')
        adminStore.loadLawyers()
        return
      } else {
        message.error('Erro ao resetar senha!')
        return
      }
    }
  }, [adminStore, selectedLawyer])

  const type: RowSelectionType = 'checkbox'

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    type,
  }

  const columns = useMemo(() => {
    const data: ColumnType<Lawyer>[] = []

    data.push({
      title: () => <span className="custom-tab-title">Usuários</span>,
      key: 'name',
      render: (_text: string, record: Lawyer) => `${record.name}`,
    })

    data.push({
      title: () => <span className="custom-tab-title">Grupo</span>,
      dataIndex: ['group', 'name'],
      key: 'group',
    })

    return data
  }, [])

  const actionsButtons = useCallback(() => {
    if (newUser) {
      return [
        <Button
          type="primary"
          onClick={createHandle}
          key="edit"
          style={{
            width: isPortrait ? '30vw' : '15vw',
          }}
        >
          CRIAR
        </Button>,
      ]
    }

    if (editable) {
      return [
        <Button
          type="primary"
          onClick={() => setEditable(!editable)}
          key="return"
          style={{
            width: isPortrait ? '30vw' : '15vw',
          }}
        >
          {<FontAwesomeIcon icon={faUndo} />}
        </Button>,
        <Button
          type="primary"
          onClick={updateHandle}
          key="edit"
          style={{
            width: isPortrait ? '30vw' : '15vw',
          }}
        >
          ATUALIZAR
        </Button>,
      ]
    }

    return [
      <Tooltip title="Deletar Advogado" key="delete">
        <Popconfirm
          title="Deseja realmente deletar o advogado?"
          onConfirm={() => deleteHandler()}
          okButtonProps={{ danger: true }}
          okText="Excluir"
          cancelText="Não"
        >
          <Button
            style={{
              backgroundColor: '#A81A1A',
              color: '#FFFFFF',
              borderColor: '#A81A1A',
              width: isPortrait ? '30vw' : '15vw',
            }}
          >
            EXCLUIR
          </Button>
        </Popconfirm>
      </Tooltip>,
      <Button
        type="primary"
        onClick={() => setEditable(!editable)}
        key="edit"
        style={{
          width: isPortrait ? '30vw' : '15vw',
        }}
      >
        {newUser ? 'SALVAR' : 'EDITAR'}
      </Button>,
    ]
  }, [newUser, editable, createHandle, deleteHandler, updateHandle, isPortrait])

  useEffect(() => {
    adminStore.loadLawyers()
    msgraphStore.loadUsers()
    groupStore.loadGroups()
  }, [adminStore, msgraphStore, groupStore])

  useEffect(() => {
    let group = ''

    if (selectedRowKeys.length > 0) {
      const row = selectedRowKeys[selectedRowKeys.length - 1]
      const foundedLaywer = adminStore.lawyers.find((lawyer) => lawyer._id === row)

      setSelectedLawyer(foundedLaywer)

      if (selectedLawyer) {
        if (selectedLawyer.group) {
          group = selectedLawyer.group._id
        } else {
          group = ''
        }
        form.setFieldsValue({
          name: selectedLawyer.name,
          birthdate: selectedLawyer.birthdate,
          number: selectedLawyer.telephone,
          email: selectedLawyer.email,
          groupId: group,
          teamsId: selectedLawyer.teamsuserID,
        })
        setLastPassReseted(selectedLawyer.last_reseted_pwd!)
      }
    } else {
      form.setFieldsValue({
        name: undefined,
        birthdate: '',
        number: '',
        email: undefined,
        groupId: undefined,
        teamsId: undefined,
        password: undefined,
        confirmation: undefined,
      })
    }
  }, [selectedRowKeys, adminStore, form, selectedLawyer, lastPassReseted])

  return (
    <AdminLayout
      onBack={() => history.push('/admin')}
      title="Área administrativa"
      isAdminPage
      content={
        <Content>
          <div
            style={{
              display: 'flex',
              alignItems: isPortrait ? 'center' : 'flex-start',
              justifyContent: isPortrait ? 'center' : 'flex-start',
              flexDirection: isPortrait ? 'column' : 'row',
              marginTop: '30px',
            }}
          >
            <Table
              className="custom-table"
              pagination={{ style: { marginRight: '10px' } }}
              columns={columns}
              rowKey="_id"
              dataSource={adminStore.lawyers}
              rowSelection={rowSelection}
              style={{
                width: isPortrait ? '95vw' : '70vw',
                marginLeft: isPortrait ? 0 : '10px',
                marginRight: isPortrait ? 0 : '10px',
                marginBottom: isPortrait ? '10px' : 0,
                maxHeight: '62vh',
                overflowY: 'auto',
              }}
            />
            <Card
              className="custom-card"
              title={<span style={titleStyle('20px')}>Detalhes do Usuário</span>}
              extra={
                <Button
                  type="primary"
                  onClick={() => {
                    setEditable(!editable)
                    changeButtonText(!editable)
                    setNewUser(!newUser)
                    setSelectedRowKeys([])
                  }}
                  style={{
                    backgroundColor: !editable ? '' : '#A81A1A',
                    borderColor: !editable ? '' : '#A81A1A',
                  }}
                  disabled={!newEnable}
                >
                  {newButtonText} {<FontAwesomeIcon icon={faUserPlus} />}
                </Button>
              }
              style={{
                width: isPortrait ? '95vw' : '50vw',
                marginRight: isPortrait ? 0 : '10px',
                height: '62vh',
                overflowY: 'auto',
                marginBottom: isPortrait ? '10px' : 0,
              }}
              actions={actionsButtons()}
            >
              <Form form={form} layout="vertical">
                <Form.Item
                  name="name"
                  key="name"
                  label="Nome Completo:"
                  rules={[{ required: true }]}
                >
                  <Input allowClear disabled={!editable} className="custom-input" />
                </Form.Item>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: isPortrait ? 'column' : 'row',
                  }}
                >
                  <Form.Item
                    name="birthdate"
                    key="birthdate"
                    label="Data de Nascimento:"
                    style={{
                      marginRight: isPortrait ? 0 : '10px',
                      width: isPortrait ? '100%' : '50%',
                    }}
                  >
                    <NumberFormat
                      style={{
                        boxShadow: '0px 0px 3px #33333380',
                        width: '100%',
                        marginRight: '10px',
                      }}
                      disabled={!editable}
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
                      disabled={!editable}
                    />
                  </Form.Item>
                </div>
                <Form.Item name="email" key="email" label="E-mail:" rules={[{ required: true }]}>
                  <Input allowClear disabled={!editable} className="custom-input" />
                </Form.Item>
                <Form.Item name="groupId" key="groupId" label="Grupo:" rules={[{ required: true }]}>
                  <Select
                    className="custom-select"
                    disabled={!editable}
                    loading={groupStore.groupsLoading}
                  >
                    {groupStore.groups.map((group) => (
                      <Select.Option value={group._id} key={group._id}>
                        {group.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                {/* <Form.Item
                  name="expertise"
                  key="expertise"
                  label="Especialidade:"
                  rules={[{ required: true }]}
                >
                  <Input allowClear disabled={!editable} className="custom-input" />
                </Form.Item> */}
                <Form.Item name="teamsId" key="teamsId" label="Usuário Teams">
                  <Select
                    className="custom-select"
                    disabled={!editable}
                    loading={msgraphStore.usersLoading}
                  >
                    {msgraphStore.users.map((teamsUser) => (
                      <Select.Option value={teamsUser.id} key={teamsUser.id}>
                        {teamsUser.displayName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                {!newUser && (
                  <Popconfirm
                    title="Deseja realmente resetar a senha desse advogado?"
                    onConfirm={() => onResetPass()}
                    okButtonProps={{ danger: true }}
                    okText="Sim"
                    cancelText="Não"
                    disabled={!editable}
                  >
                    <Button
                      type="primary"
                      style={{
                        backgroundColor: editable ? '#A81A1A' : '#e6e2d8',
                        color: '#FFFFFF',
                        borderColor: editable ? '#A81A1A' : '#e6e2d8',
                        width: isPortrait ? '15vw' : '10vw',
                      }}
                      // onClick={onEditPass}
                      disabled={!editable}
                    >
                      <FontAwesomeIcon
                        icon={faLock}
                        size="1x"
                        style={{ cursor: 'pointer', marginRight: '10px' }}
                      />{' '}
                      {'RESETAR SENHA'}
                    </Button>
                  </Popconfirm>
                )}
                {!newUser && (
                  <div
                    style={{
                      marginTop: '8px',
                      fontSize: '12px',
                    }}
                  >
                    <span>
                      Último reset: <b>{lastPassReseted}</b>
                    </span>
                  </div>
                )}

                {newUser && (
                  <div>
                    <Form.Item
                      name="password"
                      key="password"
                      label="Senha:"
                      rules={[{ required: true }]}
                    >
                      <Input.Password allowClear disabled={!editable} className="custom-input" />
                    </Form.Item>
                    <Form.Item
                      name="confirmation"
                      key="confirmation"
                      label="Confirmação:"
                      rules={[{ required: true }]}
                    >
                      <Input.Password allowClear disabled={!editable} className="custom-input" />
                    </Form.Item>
                    <Checkbox checked={createAdmin} onChange={() => setCreateAdmin(!createAdmin)}>
                      Usuário Administrador
                    </Checkbox>
                  </div>
                )}
              </Form>
            </Card>
          </div>
        </Content>
      }
    />
  )
})

export default memo(AdminScreen)
