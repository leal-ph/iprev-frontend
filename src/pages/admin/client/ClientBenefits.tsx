/* eslint-disable indent */
import React, { memo, useState, useCallback, useEffect } from 'react'
import {
  Card,
  List,
  Input,
  Button,
  Popconfirm,
  Select,
  Form,
  Tag,
  Divider,
  Checkbox,
  Tooltip,
  message,
} from 'antd'
import { Lawsuit, ResponseStatus, Benefit, ScheduledBenefit } from '~/types'
import { faGavel, faTrash, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { rowDisplayCenter } from '~/utils/display'
import { useStores } from '~/hooks/use-stores'
import { observer } from 'mobx-react-lite'
import { useMediaQuery } from 'react-responsive'
import { useForm } from 'antd/es/form/Form'
import CustomModal from '~/assets/components/CustomModal'

interface Props {
  divCardStyle: React.CSSProperties
  cardStyle: React.CSSProperties
}

const ClientLawsuit = observer(({ divCardStyle, cardStyle }: Props) => {
  const {
    adminStore,
    lawsuitStore,
    lawyerStore,
    msgraphStore,
    clientStore,
    authStore,
  } = useStores()

  const [lawsuits, setLawsuits] = useState<Lawsuit[]>([])
  const [benefits, setBenefits] = useState<ScheduledBenefit[]>([])
  // const [privateNote, setPrivateNote] = useState<boolean>(false)
  const [newCommentModalState, setNewCommentModalState] = useState<boolean>(false)
  const [newCommentForm] = useForm()
  const [plannerCheckBox, setPlannerCheckBox] = useState(false)
  const [plans, setPlans] = useState([])
  const [buckets, setBuckets] = useState([])
  const [groupMembers, setGroupMembers] = useState([])
  const [addLoading, setAddLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)

  // const history = useHistory()

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  const [selectedLawsuit, setSelectedLawsuit] = useState<Lawsuit | undefined>(undefined)

  const privacy = ['Público', 'Privado']

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
  }, [lawsuitStore, adminStore.selectedClient, setLawsuits])

  const selectLawsuitHandle = useCallback(
    async (lawsuit: Lawsuit) => {
      await lawsuitStore.loadSelectedLawsuit(lawsuit._id)
      setSelectedLawsuit(lawsuitStore.selectedLawsuit)
    },
    [setSelectedLawsuit, lawsuitStore],
  )

  const excludeLawsuitHandle = useCallback(
    async (lawsuit: Lawsuit) => {
      await adminStore.deleteLawsuit(lawsuit._id)
      refreshLawsuits()
    },
    [adminStore, refreshLawsuits],
  )

  const updateInternalNotes = useCallback(
    async (internalNote: any, exclude: boolean, lawsuit: Lawsuit, privateNote: boolean) => {
      if (exclude) {
        await adminStore.deleteLawsuitInternalNote(internalNote, lawsuit._id)
        await refreshLawsuits()
        selectLawsuitHandle(lawsuit)
        // setSelectedLaysuit(lawsuitStore.selectedLawsuit)
      } else {
        await adminStore.updateLawsuitInternalNote(
          internalNote,
          lawsuit._id,
          privateNote,
          lawyerStore.currentLawyer!.name,
        )
        await refreshLawsuits()
        selectLawsuitHandle(lawsuit)
        // setSelectedLaysuit(lawsuitStore.selectedLawsuit)
      }
    },
    [adminStore, refreshLawsuits, selectLawsuitHandle, lawyerStore.currentLawyer],
  )

  const onInsertNewNote = useCallback(async () => {
    const { comment, privacy, plan, bucket, tasktitle, members } = newCommentForm.getFieldsValue()

    setSaveLoading(true)
    let privateNote = false

    if (privacy === 'Público') {
      privateNote = false
    } else if (privacy === 'Privado') {
      privateNote = true
    }

    if (selectedLawsuit) {
      await updateInternalNotes(comment, false, selectedLawsuit, privateNote)

      if (!privateNote) {
        await lawsuitStore.sendMailNotification(
          adminStore.selectedClient!.email,
          adminStore.selectedClient!.name,
          lawyerStore.currentLawyer!.name,
          lawsuitStore.selectedLawsuit!.proc_number,
          comment,
          false,
        )
      }

      if (plannerCheckBox) {
        const description = `Tarefa criada automaticamente pelo Escritório Virtual Bocayuva Advogados. \
        \n\n - Cliente vinculado: ${adminStore.selectedClient?.name} \
        \n - CPF vinculado: ${adminStore.selectedClient?.cpf} \
        \n - Contato: ${adminStore.selectedClient?.telephone} / ${adminStore.selectedClient?.email}\
        \n - Identificador do processo: ${lawsuitStore.selectedLawsuit?.proc_number} \
        \n\n - Andamento vinculado: ${comment}`

        const taskdata = {
          planId: plan,
          bucketId: bucket,
          title: tasktitle,
          assignees: members,
          description: description,
        }
        const response = await msgraphStore.createTask(taskdata)

        if (response === ResponseStatus.SUCCESS) {
          message.success('Andamento criado com sucesso!')
          setNewCommentModalState(false)
          setSaveLoading(false)
          return
        } else {
          message.error('Erro ao enviar andamento/tarefa!')
          message.success('Andamento criado com sucesso!')
          setSaveLoading(false)
          return
        }
      } else {
        message.success('Andamento criado com sucesso!')
        setSaveLoading(false)
        setNewCommentModalState(false)
        return
      }
    }
  }, [
    msgraphStore,
    plannerCheckBox,
    newCommentForm,
    selectedLawsuit,
    updateInternalNotes,
    adminStore.selectedClient,
    lawsuitStore,
    lawyerStore.currentLawyer,
  ])

  const getStatusTag = useCallback((status: string) => {
    if (status === 'Marcado') {
      return <Tag color="green">Marcado</Tag>
    } else if (status === 'Aguardando Marcação') {
      return <Tag color="gold">Aguardando Marcação</Tag>
    } else if (status === 'Benefício Recusado') {
      return <Tag color="red">Recusado</Tag>
    } else {
      return <Tag color="blue">Indefinido</Tag>
    }
  }, [])

  const onDeny = useCallback(
    async (benefitId: string) => {
      const response = await clientStore.excludeBenefits(benefitId, clientStore.currentUser?._id)
      if (response === ResponseStatus.SUCCESS) {
        message.success('Solicitação removida com sucesso')
        if (authStore.loggedUser?._id) {
          await clientStore.loadClient(authStore.loggedUser._id)
          if (clientStore.currentUser?.required_benefits) {
            setBenefits(clientStore.currentUser.required_benefits)
          }
        }
        return
      } else {
        message.error('Erro na solicitação')
        return
      }
    },
    [clientStore, authStore.loggedUser],
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
              >
                <FontAwesomeIcon icon={faCheck} style={{ cursor: 'pointer' }} />
              </Button>
            </Tooltip>
            <Popconfirm
              title="Deseja realmente recusar o benefício?"
              // onConfirm={() => updateInternalNotes(internalNote, true, lawsuit, false)}
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
    [excludeLawsuitHandle, isPortrait],
  )

  useEffect(() => {
    if (adminStore.selectedClient && adminStore.selectedClient._id) {
      refreshLawsuits()
    }
  }, [
    msgraphStore,
    selectedLawsuit,
    adminStore.selectedClient,
    // adminStore.deletedLawsuit,
    // adminStore.deletedLawsuitIN,
    // adminStore.updatedLawsuitIN,
    // adminStore.selectedClient,
    refreshLawsuits,
    selectLawsuitHandle,
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
                // onClick={() => selectLawsuitHandle(lawsuit)}
              >
                {renderBenefit(b)}
              </Card>
            ))}
        </List>
      </Card>
      {/* <Card
        className="custom-card"
        title={<div className="custom-list-title">Status do Benefício</div>}
        style={{
          ...cardStyle,
          marginLeft: isPortrait ? 0 : '5px',
          marginTop: isPortrait ? '5px' : 0,
          marginBottom: isPortrait ? '10px' : 0,
        }}
        actions={renderNewNote()}
      >
        <List locale={{ emptyText: 'SEM DADOS' }}>
          {selectedLawsuit &&
            selectedLawsuit.internal_notes?.map((note, index) => (
              <List.Item
                key={index}
                style={{
                  marginBottom: '7px',
                  borderRadius: '3px',
                  boxShadow: '0px 0px 3px #33333380',
                }}
              >
                {renderInternalNote(note, selectedLawsuit)}
              </List.Item>
            ))}
        </List>
      </Card> */}
      <CustomModal
        visible={newCommentModalState}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        destroyOnClose
        onOk={() => setNewCommentModalState(false)}
        onCancel={() => setNewCommentModalState(false)}
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
                  Adicionar comentário / andamento - {selectedLawsuit?.proc_number}
                </span>
              }
              style={{
                width: isPortrait ? '90vw' : '80vw',
                marginRight: '10px',
                height: '60vh',
                overflowY: 'auto',
              }}
            >
              <Form form={newCommentForm} layout="vertical">
                <Form.Item
                  name="comment"
                  key="comment"
                  label="Texto do comentário:"
                  rules={[{ required: true, message: 'Texto do comentário é obrigatório!' }]}
                >
                  <Input.TextArea allowClear className="custom-input" autoSize={{ minRows: 3 }} />
                </Form.Item>
                <Form.Item
                  name="privacy"
                  key="privacy"
                  label="Privacidade:"
                  rules={[{ required: true }]}
                >
                  <Select showSearch className="custom-select">
                    {privacy.map((type) => (
                      <Select.Option value={type} key={type}>
                        {type}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="checkboxPlanner" key="checkboxPlanner">
                  <Checkbox
                    checked={plannerCheckBox}
                    onChange={() => setPlannerCheckBox(!plannerCheckBox)}
                  >
                    {'  '}Criar tarefa no planner
                  </Checkbox>
                </Form.Item>
                <Form.Item
                  name="tasktitle"
                  key="tasktitle"
                  label="Título da tarefa:"
                  rules={[{ required: true }]}
                >
                  <Input allowClear className="custom-input" disabled={!plannerCheckBox} />
                </Form.Item>
                <Form.Item
                  name="tasktitle"
                  key="tasktitle"
                  label="Título da tarefa 2:"
                  rules={[{ required: true }]}
                >
                  <Input allowClear className="custom-input" disabled={!plannerCheckBox} />
                </Form.Item>
                <Form.Item name="plan" key="plan" label="Plano:" rules={[{ required: true }]}>
                  <Select showSearch className="custom-select" disabled={!plannerCheckBox}>
                    {plans.map((plan: any) => (
                      <Select.Option value={plan.planID} key={plan.planID}>
                        {plan.planName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="bucket"
                  key="bucket"
                  label="Coluna/Status:"
                  rules={[{ required: true }]}
                >
                  <Select showSearch className="custom-select" disabled={!plannerCheckBox}>
                    {buckets.map((bucket: any) => (
                      <Select.Option value={bucket.id} key={bucket.id}>
                        {bucket.bucketName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="members"
                  key="members"
                  label="Atribuir à:"
                  rules={[{ required: true }]}
                >
                  <Select
                    showSearch
                    className="custom-select"
                    disabled={!plannerCheckBox}
                    mode="multiple"
                  >
                    {groupMembers.map((member: any) => (
                      <Select.Option value={member.memberID} key={member.memberID}>
                        {member.memberName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button
                  type="primary"
                  style={{ width: isPortrait ? '30vw' : '20vw' }}
                  onClick={onInsertNewNote}
                  loading={saveLoading}
                >
                  SALVAR
                </Button>
              </div>
            </Card>
          </div>
        }
      />
    </div>
  )
})

export default memo(ClientLawsuit)
