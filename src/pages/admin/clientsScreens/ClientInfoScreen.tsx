/* eslint-disable react/display-name */
import React, { memo, useState, useCallback, useEffect } from 'react'
import AdminLayout from '~/assets/components/GlobalLayout'
import { Meeting, ResponseStatus } from '~/types'
import { Layout, Card, Tabs, List, message, Typography, Popconfirm } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faTrash } from '@fortawesome/free-solid-svg-icons'
import { displayCenter, columnDisplayStart } from '~/utils/display'

import ClientBenefits from './ClientBenefits'
import ClientPayment from './ClientPayment'

import { useHistory } from 'react-router-dom'
import { useStores } from '~/hooks/use-stores'
import { observer } from 'mobx-react-lite'
import { MSG_CLIENT_NOT_FOUND } from '~/utils/messages'
import moment from 'moment'
import 'moment/locale/pt-br'
import { useMediaQuery } from 'react-responsive'

const { Content } = Layout
const { TabPane } = Tabs

const ClientInfoScreen = observer(() => {
  const { adminStore, meetStore, msgraphStore } = useStores()

  const history = useHistory()

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  const [divStyle, setDivStyle] = useState<React.CSSProperties>({})
  const [cardStyle, setCardStyle] = useState<React.CSSProperties>({})
  const [activeTabKey, setActiveTabKey] = useState('1')
  // const [scheduledMeetings, setScheduledMeetings] = useState<Meeting[]>([])
  // const [pastMeetings, setPastMeetings] = useState<Meeting[]>([])

  const refreshMeetings = useCallback(
    async (_id) => {
      try {
        const response_future = await meetStore.loadClientFutureMeetings(_id)
        const response_past = await meetStore.loadClientPastMeetings(_id)

        if (
          response_future === ResponseStatus.SUCCESS &&
          response_past === ResponseStatus.SUCCESS
        ) {
          return
        }
        message.error(MSG_CLIENT_NOT_FOUND)
      } catch (error) {
        console.error(error)
      }
    },
    [meetStore],
  )

  const excludeMeetHandle = useCallback(
    async (meeting: Meeting) => {
      try {
        if (meeting.id_teams && meeting.lawyer._id && meeting.lawyer.teamsuserID) {
          const response = await msgraphStore.deleteMeeting(
            meeting.id_teams,
            meeting.lawyer.teamsuserID,
            meeting._id,
          )

          if (response === ResponseStatus.SUCCESS) {
            refreshMeetings(adminStore.selectedClient!._id)
            return
          }
          message.error(MSG_CLIENT_NOT_FOUND)
        }
      } catch (error) {
        console.error(error)
      }
    },
    [msgraphStore, adminStore.selectedClient, refreshMeetings],
  )

  const renderMeeting = useCallback(
    (meeting: Meeting, actions: boolean) => {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginLeft: '10px',
            marginRight: '10px',
            width: '100%',
          }}
        >
          <div>
            <FontAwesomeIcon icon={faCalendarAlt} size="2x" />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <span>{moment(meeting.date).utcOffset('+0000').format('DD-MM-YYYY HH:mm:ss')}</span>
            <span>
              <Typography.Link href={meeting.link} target="_blank">
                Entrar na reunião
              </Typography.Link>
            </span>
          </div>
          {actions && (
            <div>
              <Popconfirm
                title="Deseja realmente cancelar esta reunião?"
                onConfirm={() => excludeMeetHandle(meeting)}
                okButtonProps={{ danger: true }}
                okText="Excluir"
                cancelText="Não"
              >
                <FontAwesomeIcon
                  size="1x"
                  icon={faTrash}
                  style={{ marginRight: '10px', cursor: 'pointer' }}
                />
              </Popconfirm>
            </div>
          )}
        </div>
      )
    },
    [excludeMeetHandle],
  )

  /* const renderTab = (props: any, DefaultTabBar: React.ComponentType) => (
    <DefaultTabBar {...props} className="custom-tab-bar" />
  ) */

  useEffect(() => {
    if (adminStore.selectedClient && adminStore.selectedClient._id) {
      refreshMeetings(adminStore.selectedClient._id)
    }
  }, [adminStore.selectedClient, refreshMeetings, msgraphStore])

  useEffect(() => {
    setDivStyle({
      width: '90vw',
      height: '80vh',
      display: 'flex',
      flexDirection: isPortrait ? 'column' : 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: isPortrait ? '10px' : 0,
    })

    setCardStyle({
      width: isPortrait ? '90%' : '48%',
      height: '90%',
      overflowY: 'auto',
    })
  }, [isPortrait])

  return (
    <AdminLayout
      onBack={() => history.push('/admin/clients')}
      title="Associados"
      isAdminPage
      content={
        <Content className="card-tabs-custom" style={{ marginBottom: '20px', marginTop: '15px' }}>
          {adminStore.selectedClient && (
            <Tabs
              // renderTabBar={renderTab}
              style={displayCenter}
              onChange={(activeKey) => {
                setActiveTabKey(activeKey)
              }}
              activeKey={activeTabKey}
              destroyInactiveTabPane
            >
              <TabPane tab={<span className="custom-tab-title">Início</span>} key="1">
                <div style={divStyle}>
                  <Card
                    className="custom-card"
                    title={<span className={'custom-item-title'}>Dados Pessoais</span>}
                    style={{
                      ...cardStyle,
                      marginRight: isPortrait ? 0 : '5px',
                    }}
                  >
                    <List>
                      <List.Item style={columnDisplayStart}>
                        <span style={{ fontWeight: 'bold' }}>NOME:</span>
                        <span>{adminStore.selectedClient.name}</span>
                      </List.Item>
                      {adminStore.selectedClient.birthdate && (
                        <List.Item style={columnDisplayStart}>
                          <span style={{ fontWeight: 'bold' }}>DATA DE NASCIMENTO:</span>
                          <span>{adminStore.selectedClient.birthdate}</span>
                        </List.Item>
                      )}
                      <List.Item style={columnDisplayStart}>
                        <span style={{ fontWeight: 'bold' }}>E-MAIL:</span>
                        <span>{adminStore.selectedClient.email}</span>
                      </List.Item>
                      {adminStore.selectedClient.cpf && adminStore.selectedClient.rg && (
                        <List.Item style={columnDisplayStart}>
                          <span style={{ fontWeight: 'bold' }}>CPF / RG:</span>
                          <span>
                            {adminStore.selectedClient.cpf.replace(
                              /(\d{3})(\d{3})(\d{3})(\d{2})/,
                              '$1.$2.$3-$4',
                            )}{' '}
                            / {adminStore.selectedClient.rg} -
                            {adminStore.selectedClient.rg_consignor
                              ? adminStore.selectedClient.rg_consignor
                              : ' N/A'}
                          </span>
                        </List.Item>
                      )}
                      {adminStore.selectedClient.telephone && (
                        <List.Item style={columnDisplayStart}>
                          <span style={{ fontWeight: 'bold' }}>TELEFONE:</span>
                          <span>{adminStore.selectedClient.telephone}</span>
                        </List.Item>
                      )}
                      {adminStore.selectedClient.address && (
                        <List.Item style={columnDisplayStart}>
                          <span style={{ fontWeight: 'bold' }}>
                            ENDEREÇO / CEP / CIDADE / ESTADO:
                          </span>
                          <span>
                            {adminStore.selectedClient.address} --{' '}
                            {adminStore.selectedClient.zipcode} -- {adminStore.selectedClient.city}{' '}
                            -- {adminStore.selectedClient.state}
                          </span>
                        </List.Item>
                      )}
                      {adminStore.selectedClient.profession && (
                        <List.Item style={columnDisplayStart}>
                          <span style={{ fontWeight: 'bold' }}>PROFISSÃO:</span>
                          <span>{adminStore.selectedClient.profession}</span>
                        </List.Item>
                      )}
                      {adminStore.selectedClient.marital_status && (
                        <List.Item style={columnDisplayStart}>
                          <span style={{ fontWeight: 'bold' }}>ESTADO CIVIL:</span>
                          <span>{adminStore.selectedClient.marital_status}</span>
                        </List.Item>
                      )}
                    </List>
                    <List
                      header={<div className="custom-list-title">Vida Contributiva</div>}
                      locale={{ emptyText: 'SEM DADOS' }}
                    >
                      {adminStore.selectedClient.form_answers?.map((form) =>
                        form.map((question: Array<string>) => (
                          <List.Item
                            key={`answer-${adminStore.selectedClient!.form_answers[0].indexOf(
                              question,
                            )}`}
                          >
                            <b>{question[0]}</b>
                            <br></br>
                            {question[1]}
                            <br></br>
                          </List.Item>
                        )),
                      )}
                    </List>
                  </Card>
                  <Card
                    className="custom-card"
                    title={<span className={'custom-item-title'}>Reuniões</span>}
                    style={{
                      ...cardStyle,
                      marginLeft: isPortrait ? 0 : '5px',
                      marginTop: isPortrait ? '5px' : 0,
                      marginBottom: isPortrait ? '10px' : 0,
                    }}
                  >
                    <List
                      header={<div className="custom-list-title">Agendadas</div>}
                      locale={{ emptyText: 'SEM DADOS' }}
                    >
                      {meetStore.clientMeetings.length > 0 &&
                        meetStore.clientMeetings.map((meeting) => (
                          <List.Item key={meeting._id} className="custom-list-item">
                            {renderMeeting(meeting, true)}
                          </List.Item>
                        ))}
                    </List>
                    <List
                      header={<div className="custom-list-title">Realizadas</div>}
                      locale={{ emptyText: 'SEM DADOS' }}
                    >
                      {meetStore.clientPastMeetings.length > 0 &&
                        meetStore.clientPastMeetings.map((meeting) => (
                          <List.Item key={meeting._id} className="custom-list-item">
                            {renderMeeting(meeting, false)}
                          </List.Item>
                        ))}
                    </List>
                  </Card>
                </div>
              </TabPane>
              <TabPane tab={<span className="custom-tab-title">Benefícios</span>} key="2">
                <ClientBenefits divCardStyle={divStyle} cardStyle={cardStyle} />
              </TabPane>
              <TabPane tab={<span className="custom-tab-title">Pagamentos</span>} key="3">
                <ClientPayment divCardStyle={divStyle} cardStyle={cardStyle} />
              </TabPane>
            </Tabs>
          )}
        </Content>
      }
    />
  )
})

export default memo(ClientInfoScreen)
