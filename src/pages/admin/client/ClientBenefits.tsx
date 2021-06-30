/* eslint-disable indent */
import React, { memo, useState, useCallback, useEffect } from 'react'
import {
  Card,
  List,
  Button,
  Popconfirm,
  Form,
  Tag,
  Modal,
  DatePicker,
  Tooltip,
  message,
} from 'antd'
import { ResponseStatus, ScheduledBenefit } from '~/types'
import { faGavel, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useStores } from '~/hooks/use-stores'
import { observer } from 'mobx-react-lite'
import { useMediaQuery } from 'react-responsive'
import { useForm } from 'antd/es/form/Form'

import moment from 'moment'

interface Props {
  divCardStyle: React.CSSProperties
  cardStyle: React.CSSProperties
}

const ClientLawsuit = observer(({ divCardStyle, cardStyle }: Props) => {
  const { adminStore, lawsuitStore, msgraphStore, clientStore, authStore } = useStores()

  const [benefits, setBenefits] = useState<ScheduledBenefit[]>([])
  // const [privateNote, setPrivateNote] = useState<boolean>(false)
  const [newCommentModalState, setNewCommentModalState] = useState<boolean>(false)
  const [newCommentForm] = useForm()

  // const history = useHistory()

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  const [selectedBenefit, setSelectedBenefit] = useState<ScheduledBenefit | undefined>(undefined)

  const refreshLawsuits = useCallback(async () => {
    try {
      if (adminStore.selectedClient && adminStore.selectedClient.required_benefits) {
        // await lawsuitStore.loadClientLawsuits(adminStore.selectedClient._id)
        setBenefits(adminStore.selectedClient.required_benefits)
      }
    } catch (error) {
      lawsuitStore.selectedLawsuit = undefined
      console.error(error)
    }
  }, [lawsuitStore, adminStore.selectedClient])

  const getStatusTag = useCallback((status: string) => {
    if (status === 'Marcado') {
      return <Tag color="green">Marcado</Tag>
    } else if (status === 'Aguardando Marcação') {
      return <Tag color="gold">Aguardando Marcação</Tag>
    } else if (status === 'Recusado') {
      return <Tag color="red">Recusado</Tag>
    } else {
      return <Tag color="blue">Indefinido</Tag>
    }
  }, [])

  const onDeny = useCallback(
    async (benefitId: string) => {
      const now = new Date()

      const response = await clientStore.updateBenefitStatus(
        benefitId,
        adminStore.selectedClient?._id,
        'Recusado',
        now,
      )
      if (response === ResponseStatus.SUCCESS) {
        message.success('Solicitação recusada com sucesso')
        if (authStore.loggedUser?._id) {
          await adminStore.loadSelectedClient(adminStore.selectedClient?._id)
          if (adminStore.selectedClient?.required_benefits) {
            setBenefits(adminStore.selectedClient.required_benefits)
          }
        }
        return
      } else {
        message.error('Erro na solicitação')
        return
      }
    },
    [clientStore, authStore.loggedUser, adminStore],
  )

  const onSchedule = useCallback(
    async (benefitId: string) => {
      const { date } = newCommentForm.getFieldsValue()

      const response = await clientStore.updateBenefitStatus(
        benefitId,
        adminStore.selectedClient?._id,
        'Marcado',
        date,
      )
      if (response === ResponseStatus.SUCCESS) {
        message.success('Solicitação marcada com sucesso')
        if (authStore.loggedUser?._id) {
          await adminStore.loadSelectedClient(adminStore.selectedClient?._id)
          if (adminStore.selectedClient?.required_benefits) {
            setBenefits(adminStore.selectedClient.required_benefits)
          }
        }
        setNewCommentModalState(false)
        return
      } else {
        message.error('Erro na solicitação')
        return
      }
    },
    [clientStore, authStore.loggedUser, adminStore, newCommentForm],
  )

  const renderBenefit = useCallback(
    (benefit: ScheduledBenefit) => {
      return (
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginLeft: '10px',
            marginRight: '10px',
          }}
        >
          <div>
            <span style={{ fontWeight: 'bold' }}>{`Benefício: `} </span>{' '}
            <span>{`${benefit.benefit.companyName}`}</span>
            <br></br>
            <span style={{ fontWeight: 'bold' }}>Categoria:</span> {benefit.benefit.companyCategory}
            <br></br>
            <span style={{ fontWeight: 'bold' }}>Status:</span> {getStatusTag(benefit.status)}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            ></div>
          </div>
          <div style={{ marginRight: '10px' }}>
            <Tooltip title={'Agendar'}>
              <Button
                className={'custom-button'}
                style={{
                  backgroundColor: '#5FBA53',
                  color: '#FFFFFF',
                  borderColor: '#5FBA53',
                  marginRight: '10px',
                  // width: isPortrait ? '30vw' : '15vw',
                }}
                onClick={() => setNewCommentModalState(true)}
              >
                <FontAwesomeIcon icon={faCheck} style={{ cursor: 'pointer' }} />
              </Button>
            </Tooltip>
            <Popconfirm
              title="Deseja realmente recusar o benefício?"
              onConfirm={() => onDeny(benefit.benefit._id)}
              okButtonProps={{ danger: true }}
              okText="Excluir"
              cancelText="Não"
            >
              <Tooltip title={'Recusar'}>
                <Button
                  style={{
                    backgroundColor: '#A81A1A',
                    color: '#FFFFFF',
                    borderColor: '#A81A1A',
                    // width: isPortrait ? '30vw' : '15vw',
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} style={{ cursor: 'pointer' }} />
                </Button>
              </Tooltip>
            </Popconfirm>
          </div>
        </div>
      )
    },
    [getStatusTag, onDeny],
  )

  useEffect(() => {
    if (adminStore.selectedClient && adminStore.selectedClient._id) {
      refreshLawsuits()
    }
  }, [
    msgraphStore,
    adminStore.selectedClient,
    // adminStore.deletedLawsuit,
    // adminStore.deletedLawsuitIN,
    // adminStore.updatedLawsuitIN,
    // adminStore.selectedClient,
    refreshLawsuits,
  ])

  return (
    <div style={divCardStyle}>
      <Card
        className="custom-card"
        title={<div className="custom-list-title">Benefícios Solicitados</div>}
        style={cardStyle}
      >
        <List locale={{ emptyText: 'SEM DADOS' }}>
          {benefits &&
            benefits.map((b) => (
              <Card
                title={
                  <div>
                    <FontAwesomeIcon
                      icon={faGavel}
                      style={{ marginRight: '10px', opacity: '50%' }}
                    />
                    <span>{b.benefit.companyName}</span>
                  </div>
                }
                size="small"
                className="custom-card-item-selectable"
                key={b.benefit._id}
                style={{
                  marginBottom: '7px',
                  borderRadius: '3px',
                  boxShadow: '0px 0px 3px #33333380',
                }}
                headStyle={{ backgroundColor: '#f5f5f5' }}
                onClick={() => setSelectedBenefit(b)}
              >
                {renderBenefit(b)}
              </Card>
            ))}
        </List>
      </Card>
      <Modal
        visible={newCommentModalState}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        destroyOnClose
        onOk={() => setNewCommentModalState(false)}
        onCancel={() => setNewCommentModalState(false)}
        width={isPortrait ? '95vw' : '50%'}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Form form={newCommentForm} layout="vertical">
            <Form.Item
              name="date"
              key="date"
              label="Selecione a data:"
              rules={[{ required: true, message: 'Data é obrigatório!' }]}
            >
              <DatePicker
                style={{
                  width: isPortrait ? '70vw' : '12vw',
                  marginRight: '5px',
                  marginBottom: isPortrait ? '10px' : 0,
                }}
                placeholder="Selecione a data"
                format="DD/MM/YYYY HH:mm"
                showTime={{ defaultValue: moment('00:00', 'HH:mm') }}
              ></DatePicker>
            </Form.Item>
          </Form>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button
              type="primary"
              style={{ width: isPortrait ? '30vw' : '20vw' }}
              onClick={() => onSchedule(selectedBenefit?.benefit._id)}
            >
              SALVAR
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
})

export default memo(ClientLawsuit)
