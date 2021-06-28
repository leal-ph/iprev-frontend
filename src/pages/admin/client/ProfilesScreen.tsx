/* eslint-disable react/display-name */
import React, { memo, useState, useMemo, useCallback, useEffect } from 'react'
import AdminLayout from '../../GlobalLayout'
import { Profile } from '~/types'
import { Table, Layout, Card, Button, Form, Input, message, Select, Popconfirm } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { ColumnType } from 'antd/lib/table'
import { RowSelectionType } from 'antd/lib/table/interface'

import { useStores } from '~/hooks/use-stores'
import { ResponseStatus } from '~/types'
import { useHistory } from 'react-router-dom'
import {
  MSG_PROFILE_CREATED,
  MSG_PROFILE_CREATED_ERROR,
  MSG_PROFILE_DELETD,
  MSG_PROFILE_DELETD_ERROR,
  MSG_PROFILE_UPDATED,
  MSG_PROFILE_UPDATED_ERROR,
} from '~/utils/messages'
import { observer } from 'mobx-react-lite'
import NumberFormat from 'react-number-format'
import { useMediaQuery } from 'react-responsive'
import { titleStyle } from '../../styles'

const { Content } = Layout

const convertNumber = (value: string) => {
  return parseFloat(value.toString().replace('R$', '').replace('.', '').replace(',', '.'))
}

const ProfilesScreen = observer(() => {
  const { profileStore } = useStores()

  const history = useHistory()

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  const [form] = Form.useForm()

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])

  const createHandle = useCallback(() => {
    form
      .validateFields()
      .then(async () => {
        const { text, title, documents, price } = form.getFieldsValue()

        const selectedProfile = selectedRowKeys[selectedRowKeys.length - 1]
        if (selectedProfile) {
          const response = await profileStore.update(selectedProfile, {
            text,
            title,
            neededDocuments: documents.map((d: string) => d.toUpperCase().slice(0, 50)),
            initialPriceCents: convertNumber(price) * 100,
          })

          if (response === ResponseStatus.SUCCESS) {
            message.success(MSG_PROFILE_UPDATED)
            return
          }

          message.error(MSG_PROFILE_UPDATED_ERROR)
        } else {
          const response = await profileStore.save({
            text,
            title,
            neededDocuments: documents,
            initialPriceCents: convertNumber(price) * 100,
          })

          if (response === ResponseStatus.SUCCESS) {
            message.success(MSG_PROFILE_CREATED)
            profileStore.loadAll()
            return
          }

          message.error(MSG_PROFILE_CREATED_ERROR)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }, [form, profileStore, selectedRowKeys])

  const deleteHandler = useCallback(
    async (id: string) => {
      const response = await profileStore.delete(id)
      if (response === ResponseStatus.SUCCESS) {
        message.success(MSG_PROFILE_DELETD)
        profileStore.loadAll()
        return
      }
      message.error(MSG_PROFILE_DELETD_ERROR)
    },
    [profileStore],
  )

  const onSelectChange = useCallback(
    (selectedRowKeys) => {
      if (selectedRowKeys) {
        const value = selectedRowKeys.pop()
        if (value) {
          setSelectedRowKeys([value])
        } else {
          setSelectedRowKeys([])
        }
      }
    },
    [setSelectedRowKeys],
  )

  const type: RowSelectionType = 'checkbox'

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    type,
  }

  const columns = useMemo(() => {
    const data: ColumnType<Profile>[] = []

    data.push({
      title: () => <span className="custom-tab-title">Benefício</span>,
      key: 'title',
      render: (value: Profile) => {
        return <div>{value.title}</div>
      },
    })

    !isPortrait &&
      data.push({
        key: 'actions',
        render: (value: Profile) => (
          <Popconfirm
            title="Deseja remover este perfil?"
            onConfirm={() => deleteHandler(value._id)}
          >
            <FontAwesomeIcon icon={faTrash} style={{ cursor: 'pointer' }} />
          </Popconfirm>
        ),
      })

    return data
  }, [deleteHandler, isPortrait])

  const setDefaults = useCallback(() => {
    const selectedKey = selectedRowKeys[selectedRowKeys.length - 1]
    if (selectedKey) {
      const selectedProfile = profileStore.profiles.find((p) => p._id === selectedKey)
      if (selectedProfile) {
        form.setFieldsValue({
          title: selectedProfile.title,
          text: selectedProfile.text,
          documents: selectedProfile.neededDocuments,
          price: selectedProfile.initialPriceCents / 100,
        })
      }
    } else {
      form.setFieldsValue({
        title: undefined,
        text: undefined,
        documents: [],
        price: undefined,
      })
    }
  }, [form, selectedRowKeys, profileStore.profiles])

  useEffect(() => {
    setDefaults()
  }, [setDefaults])

  useEffect(() => {
    profileStore.loadAll()
  }, [profileStore])

  return (
    <AdminLayout
      onBack={() => history.push('/admin')}
      title="Benefícios"
      isAdminPage
      content={
        <Content>
          <div
            style={{
              display: 'flex',
              alignItems: isPortrait ? 'center' : 'flex-start',
              justifyContent: isPortrait ? 'center' : 'flex-start',
              flexDirection: isPortrait ? 'column' : 'row',
              marginTop: '15px',
            }}
          >
            <Table
              className="custom-table"
              pagination={{ style: { marginRight: '10px' } }}
              columns={columns}
              rowKey="_id"
              dataSource={profileStore.profiles}
              loading={profileStore.loadingProfiles}
              rowSelection={rowSelection}
              style={{
                width: isPortrait ? '95vw' : '50vw',
                marginLeft: isPortrait ? 0 : '10px',
                marginRight: isPortrait ? 0 : '10px',
                marginBottom: isPortrait ? '10px' : 0,
                maxHeight: '62vh',
                overflowY: 'auto',
              }}
            />
            <Card
              className="custom-card"
              title={<span style={titleStyle('20px')}>Detalhes do Benefício</span>}
              style={{
                width: isPortrait ? '95vw' : '60vw',
                marginRight: isPortrait ? 0 : '10px',
                height: '62vh',
                overflowY: 'auto',
                marginBottom: isPortrait ? '10px' : 0,
              }}
            >
              <Form form={form} layout="vertical">
                <Form.Item
                  name="title"
                  key="title"
                  label="Título:"
                  rules={[{ required: true, message: 'Título obrigatório!' }]}
                >
                  <Input allowClear className="custom-input" />
                </Form.Item>
                <Form.Item
                  name="text"
                  key="text"
                  label="Texto:"
                  rules={[{ required: true, message: 'Texto obrigatório!' }]}
                >
                  <Input.TextArea allowClear className="custom-input" />
                </Form.Item>
                <Form.Item
                  name="price"
                  key="price"
                  label="Cobrança inicial:"
                  rules={[{ required: true, message: 'Valor obrigatório!' }]}
                  style={{ width: '100%', marginRight: isPortrait ? 0 : '10px' }}
                >
                  <NumberFormat
                    className="ant-input custom-input"
                    thousandSeparator={'.'}
                    decimalSeparator={','}
                    prefix={'R$ '}
                    placeholder={'R$ 0,00'}
                  />
                </Form.Item>
                <Form.Item
                  name="documents"
                  key="documents"
                  label="Documentos Necessários (Limite de 50 caracteres por documento):"
                  rules={[{ required: true, message: 'Documentos são obrigatórios!' }]}
                >
                  <Select
                    mode="tags"
                    className="custom-input"
                    maxTagTextLength={50}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Form>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="primary"
                  loading={profileStore.actionLoading}
                  onClick={createHandle}
                  style={{ width: isPortrait ? '30vw' : '15vw' }}
                >
                  SALVAR
                </Button>
              </div>
            </Card>
          </div>
        </Content>
      }
    />
  )
})

export default memo(ProfilesScreen)
