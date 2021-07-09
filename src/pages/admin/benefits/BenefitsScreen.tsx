/* eslint-disable react/display-name */
import React, { memo, useState, useMemo, useCallback, useEffect } from 'react'
import AdminLayout from '~/assets/components/GlobalLayout'
import { Benefit } from '~/types'
import { Table, Layout, Card, Button, Form, Input, message, Popconfirm } from 'antd'
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
import { useMediaQuery } from 'react-responsive'
import { titleStyle } from '../../styles'

const { Content } = Layout

const BenefitsScreen = observer(() => {
  const { benefitStore } = useStores()

  const history = useHistory()

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  const [form] = Form.useForm()

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])

  const createHandle = useCallback(() => {
    form
      .validateFields()
      .then(async () => {
        const { companyName, companyCategory, description } = form.getFieldsValue()

        const selectedBenefit = selectedRowKeys[selectedRowKeys.length - 1]
        if (selectedBenefit) {
          const response = await benefitStore.update(selectedBenefit, {
            companyName,
            companyCategory,
            description,
          })

          if (response === ResponseStatus.SUCCESS) {
            message.success(MSG_PROFILE_UPDATED)
            return
          }

          message.error(MSG_PROFILE_UPDATED_ERROR)
        } else {
          const response = await benefitStore.save({
            companyName,
            companyCategory,
            description,
          })

          if (response === ResponseStatus.SUCCESS) {
            message.success(MSG_PROFILE_CREATED)
            benefitStore.loadAll()
            return
          }

          message.error(MSG_PROFILE_CREATED_ERROR)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }, [form, benefitStore, selectedRowKeys])

  const deleteHandler = useCallback(
    async (id: string) => {
      const response = await benefitStore.delete(id)
      if (response === ResponseStatus.SUCCESS) {
        message.success(MSG_PROFILE_DELETD)
        benefitStore.loadAll()
        return
      }
      message.error(MSG_PROFILE_DELETD_ERROR)
    },
    [benefitStore],
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
    const data: ColumnType<Benefit>[] = []

    data.push({
      title: () => <span className="custom-tab-title">Nome da empresa</span>,
      key: 'title',
      render: (value: Benefit) => {
        return <div>{value.companyName}</div>
      },
    })

    data.push({
      title: () => <span className="custom-tab-title">Categoria</span>,
      key: 'companyCategory',
      render: (value: Benefit) => {
        return <div>{value.companyCategory}</div>
      },
    })

    !isPortrait &&
      data.push({
        key: 'actions',
        render: (value: Benefit) => (
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
      const selectedBenefit = benefitStore.benefits.find((p) => p._id === selectedKey)
      if (selectedBenefit) {
        form.setFieldsValue({
          companyName: selectedBenefit.companyName,
          companyCategory: selectedBenefit.companyCategory,
          description: selectedBenefit.description,
        })
      }
    } else {
      form.setFieldsValue({
        companyName: undefined,
        companyCategory: undefined,
        description: undefined,
      })
    }
  }, [form, selectedRowKeys, benefitStore.benefits])

  useEffect(() => {
    setDefaults()
  }, [setDefaults])

  useEffect(() => {
    benefitStore.loadAll()
  }, [benefitStore])

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
              dataSource={benefitStore.benefits}
              loading={benefitStore.loadingBenefits}
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
                  name="companyName"
                  key="companyName"
                  label="Nome:"
                  rules={[{ required: true, message: 'Nome obrigatório!' }]}
                >
                  <Input allowClear className="custom-input" />
                </Form.Item>
                <Form.Item
                  name="companyCategory"
                  key="companyCategory"
                  label="Categoria:"
                  rules={[{ required: true, message: 'Categoria obrigatória!' }]}
                >
                  <Input allowClear className="custom-input" />
                </Form.Item>
                <Form.Item
                  name="description"
                  key="description"
                  label="Descrição:"
                  rules={[{ required: true, message: 'Descrição obrigatória!' }]}
                >
                  <Input.TextArea allowClear className="custom-input" />
                </Form.Item>
              </Form>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="primary"
                  loading={benefitStore.actionLoading}
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

export default memo(BenefitsScreen)
