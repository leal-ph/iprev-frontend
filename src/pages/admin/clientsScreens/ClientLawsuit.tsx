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
  message,
} from 'antd'
import { Lawsuit, ResponseStatus } from '~/types'
import { faGavel, faTrash } from '@fortawesome/free-solid-svg-icons'
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
  const { adminStore, lawsuitStore, lawyerStore, msgraphStore } = useStores()

  const [lawsuits, setLawsuits] = useState<Lawsuit[]>([])
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
      if (adminStore.selectedClient) {
        await lawsuitStore.loadClientLawsuits(adminStore.selectedClient._id)
        setLawsuits(lawsuitStore.lawsuits)
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

  const convertType = useCallback((mode: boolean) => {
    if (mode) {
      return <Tag color="red">PRIVADO</Tag>
    } else {
      return <Tag color="blue">PÚBLICO</Tag>
    }
  }, [])

  const convertLawsuitType = useCallback((record: Lawsuit) => {
    if (record.type === 'Administrativo') {
      return <Tag color="blue">Administrativo</Tag>
    } else if (record.type === 'Jurídico') {
      return <Tag color="geekblue">Jurídico</Tag>
    } else if (record.proc_number.replace(/\.|-/gm, '').length === 20) {
      return <Tag color="geekblue">Jurídico</Tag>
    } else {
      return <Tag color="orange">Outros</Tag>
    }
  }, [])

  const renderLawsuit = useCallback(
    (lawsuit: Lawsuit) => {
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
            <span style={{ fontWeight: 'bold' }}>{`ID / CÓDIGO: `} </span>{' '}
            <span>{`${lawsuit.proc_number}`}</span>
            <br></br>
            <span style={{ fontWeight: 'bold' }}>Tipo: {convertLawsuitType(lawsuit)}</span>
            <br></br>
            {lawsuit.notice_date && (
              <div>
                <span style={{ fontWeight: 'bold' }}>Atuação: </span>{' '}
                <span>{lawsuit.notice_date}</span>
                <br></br>
              </div>
            )}
            {lawsuit.lawyer?.name && (
              <div>
                <span style={{ fontWeight: 'bold' }}>Advogado: </span>{' '}
                <span>{lawsuit.lawyer!.name}</span>
                <br></br>
              </div>
            )}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            ></div>
          </div>
          {!isPortrait && (
            <div style={{ marginRight: '10px' }}>
              <Popconfirm
                title="Deseja realmente deletar o registro?"
                onConfirm={() => excludeLawsuitHandle(lawsuit)}
                okButtonProps={{ danger: true }}
                okText="Excluir"
                cancelText="Não"
              >
                <FontAwesomeIcon icon={faTrash} style={{ cursor: 'pointer' }} />
              </Popconfirm>
            </div>
          )}
        </div>
      )
    },
    [excludeLawsuitHandle, isPortrait, convertLawsuitType],
  )

  const renderInternalNote = useCallback(
    (internalNote: any, lawsuit: Lawsuit) => {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            whiteSpace: 'pre-wrap',
            marginLeft: '7px',
            marginRight: '7px',
          }}
        >
          <div
            style={{
              marginLeft: '10px',
              marginRight: '10px',
            }}
          >
            <span>{internalNote.info}</span>
            <Divider style={{ marginBottom: '10px', marginTop: '10px' }}></Divider>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                whiteSpace: 'pre-wrap',
                marginTop: '10px',
              }}
            >
              <span style={{ marginRight: '5px' }}>{convertType(internalNote.isPrivate)}</span>
              {
                <span
                  style={{ fontWeight: 'bold', fontSize: '13px' }}
                >{`${internalNote.date?.toString()} - por ${internalNote.lawyer}`}</span>
              }
            </div>
          </div>
          {!isPortrait && (
            <div>
              {
                <Popconfirm
                  title="Deseja realmente deletar o registro?"
                  onConfirm={() => updateInternalNotes(internalNote, true, lawsuit, false)}
                  okButtonProps={{ danger: true }}
                  okText="Excluir"
                  cancelText="Não"
                >
                  <FontAwesomeIcon icon={faTrash} style={{ cursor: 'pointer' }} />
                </Popconfirm>
              }
            </div>
          )}
        </div>
      )
    },
    [updateInternalNotes, convertType, isPortrait],
  )

  const onShowModal = useCallback(async () => {
    setAddLoading(true)
    await msgraphStore.getPlans('48473a74-a4ea-42c2-b2fb-d0bc1bbea110')
    await msgraphStore.getGroupMembers('48473a74-a4ea-42c2-b2fb-d0bc1bbea110')
    await msgraphStore.getBuckets('iBKsa4lPDE-Sh9HzkskJdGUAGQwU')
    setPlans(msgraphStore.plans)
    setGroupMembers(msgraphStore.groupMembers)
    setBuckets(msgraphStore.buckets)
    setNewCommentModalState(true)
    setAddLoading(false)
  }, [msgraphStore])

  const renderNewNote = useCallback(() => {
    if (selectedLawsuit) {
      return [
        <div key="1" style={{ ...rowDisplayCenter, flexDirection: isPortrait ? 'column' : 'row' }}>
          <Button
            onClick={() => onShowModal()}
            type="primary"
            loading={addLoading}
            style={{
              width: '50%',
              marginBottom: '15px',
            }}
          >
            {isPortrait ? 'ADICIONAR' : 'ADICIONAR ANDAMENTO'}
          </Button>
        </div>,
      ]
    }
  }, [selectedLawsuit, isPortrait, onShowModal, addLoading])

  useEffect(() => {
    if (adminStore.selectedClient && adminStore.selectedClient._id) {
      refreshLawsuits()
      if (selectedLawsuit) {
        renderInternalNote(selectedLawsuit.internal_notes, selectedLawsuit)
      }
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
    renderInternalNote,
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
          {lawsuits &&
            lawsuits.map((lawsuit) => (
              <Card
                title={
                  <div>
                    <FontAwesomeIcon
                      icon={faGavel}
                      style={{ marginRight: '10px', opacity: '50%' }}
                    />
                    <span>{lawsuit.proc_number}</span>
                  </div>
                }
                size="small"
                className="custom-card-item-selectable"
                key={lawsuit._id}
                style={{
                  marginBottom: '7px',
                  borderRadius: '3px',
                  boxShadow: '0px 0px 3px #33333380',
                }}
                headStyle={{ backgroundColor: '#f5f5f5' }}
                onClick={() => selectLawsuitHandle(lawsuit)}
              >
                {renderLawsuit(lawsuit)}
              </Card>
            ))}
        </List>
      </Card>
      <Card
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
      </Card>
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
