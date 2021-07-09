import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Calendar, Card, DatePicker, List, message, Select, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import moment, { Moment } from 'moment'
import 'moment/locale/pt-br'

import locale from 'antd/es/date-picker/locale/pt_BR'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useHistory } from 'react-router-dom'
import { useStores } from '~/hooks/use-stores'
import AdminLayout from '~/assets/components/GlobalLayout'
import { Meeting, MeetingData, ResponseStatus } from '~/types'
import {
  MSG_FIELDS_NEEDED,
  MSG_LAWYER_REGISTER_ERROR,
  MSG_MEETING_CREATED,
  MSG_MEETING_CREATED_ERROR,
} from '~/utils/messages'
import { titleStyle } from '../../styles'

const hours = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

const MenuScreen = observer(() => {
  moment.locale('pt-br')
  const { authStore, lawyerStore, adminStore, msgraphStore } = useStores()

  const history = useHistory()

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined)
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(undefined)
  const [selectedDateForm, setSelectedDateForm] = useState<string | undefined>(undefined)
  const [selectedHour, setSelectedHour] = useState<number | undefined>(undefined)

  const [meetings, setMeetings] = useState<Meeting[]>([])

  const handleSelect = (value: any) => {
    const date: Date = value._d
    // const parsedDate = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`
    setSelectedDate(moment(date).format('YYYY-MM-DD'))
  }

  const renderCellContent = useCallback(
    (date: string) => {
      if (adminStore.meetings.length > 0) {
        const match = adminStore.meetings.filter(
          (meeting) => moment(meeting.date).format('DD-MM-YYYY') === date,
        )
        if (match.length > 0) {
          return (
            <List>
              {match.map((meeting) => {
                return (
                  <List.Item key={meeting.client._id} style={{ fontSize: '10px' }}>
                    <FontAwesomeIcon icon={faCalendarAlt} /> {meeting.client.name}
                  </List.Item>
                )
              })}
            </List>
          )
        }
      }

      return <div></div>
    },
    [adminStore.meetings],
  )

  const renderMeeting = useCallback((meeting: Meeting) => {
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
        <div>
          <span>{meeting.client.name.split(' ')[0]}</span>
        </div>
      </div>
    )
  }, [])

  const meetHandle = useCallback(async () => {
    if (selectedHour && selectedClientId && selectedDateForm) {
      const startTime = `${selectedDateForm}T${hours[selectedHour]}`
      const endTime = `${selectedDateForm}T${hours[selectedHour].replace(':00', ':30')}:00`

      if (authStore.loggedUser && lawyerStore.currentLawyer && lawyerStore.currentLawyer._id) {
        const status = await adminStore.loadSelectedClient(selectedClientId)

        if (status === ResponseStatus.SUCCESS && adminStore.selectedClient) {
          const meetingData: MeetingData = {
            start: {
              dateTime: startTime,
              timeZone: 'America/Sao_Paulo',
            },
            end: {
              dateTime: endTime,
              timeZone: 'America/Sao_Paulo',
            },
            attendees: [
              {
                emailAddress: {
                  address: lawyerStore.currentLawyer.email,
                  name: lawyerStore.currentLawyer.name,
                },
                type: 'required',
              },
              {
                emailAddress: {
                  address: adminStore.selectedClient.email,
                  name: adminStore.selectedClient.name,
                },
                type: 'required',
              },
            ],
          }

          const teamsId = lawyerStore.currentLawyer.teamsuserID
          const userId = adminStore.selectedClient._id
          const lawyerId = lawyerStore.currentLawyer._id

          if (teamsId) {
            const meetResponse = await msgraphStore.createMeeting(
              teamsId,
              userId,
              lawyerId,
              selectedHour,
              meetingData,
            )

            if (meetResponse === ResponseStatus.SUCCESS) {
              message.success(MSG_MEETING_CREATED)
              adminStore.loadMeetings(lawyerStore.currentLawyer._id)
              return
            }

            message.error(MSG_MEETING_CREATED_ERROR)
          } else {
            message.error(MSG_LAWYER_REGISTER_ERROR)
          }
        }
      } else {
        message.error(MSG_MEETING_CREATED_ERROR)
      }
    } else {
      message.error(MSG_FIELDS_NEEDED)
    }
  }, [
    selectedClientId,
    selectedDateForm,
    selectedHour,
    adminStore,
    authStore.loggedUser,
    lawyerStore.currentLawyer,
    msgraphStore,
  ])

  const renderCell = useCallback(
    (date: Moment) => {
      return renderCellContent(date.format('DD-MM-YYYY'))
    },
    [renderCellContent],
  )

  useEffect(() => {
    if (lawyerStore.currentLawyer?._id && selectedDate) {
      adminStore.loadDailyMeetsInfo(lawyerStore.currentLawyer._id, selectedDate)
    }
  }, [lawyerStore.currentLawyer, adminStore, selectedDate])

  useEffect(() => {
    if (lawyerStore.currentLawyer?._id) {
      adminStore.loadMeetings(lawyerStore.currentLawyer._id)
    }
  }, [lawyerStore.currentLawyer, adminStore])

  useEffect(() => {
    if (authStore.loggedUser?._id) {
      lawyerStore.loadLawyer(authStore.loggedUser._id)
    }
  }, [authStore.loggedUser, lawyerStore])

  useEffect(() => {
    if (lawyerStore.currentLawyer?._id) {
      adminStore.loadClients(lawyerStore.currentLawyer._id, true)
    }
  }, [adminStore, lawyerStore.currentLawyer])

  useEffect(() => {
    isPortrait ? setMeetings(adminStore.meetings) : setMeetings(adminStore.dailyMeetings)
  }, [isPortrait, adminStore.dailyMeetings, adminStore.meetings])

  return (
    <AdminLayout
      title="Agendamentos"
      onBack={() => history.push('/admin')}
      isAdminPage
      content={
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginLeft: '10px',
            marginRight: '10px',
            marginBottom: '10px',
            marginTop: '20px',
            justifyContent: 'center',
          }}
        >
          {!isPortrait && (
            <div>
              <Card
                // title={<span style={titleStyle('25px')}>AGENDAR REUNIÃO COM CLIENTE</span>}
                className="custom-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  width: '98%',
                  height: '96%',
                }}
              >
                <Calendar
                  className="custom-calendar"
                  onSelect={handleSelect}
                  dateCellRender={renderCell}
                  mode="month"
                  locale={locale}
                  style={{ height: '88vh', width: '99%', overflowY: 'auto' }}
                />
              </Card>
            </div>
          )}
          <div>
            <div style={{ width: isPortrait ? '90vw' : '30vw' }}>
              <Card
                title={<span style={titleStyle('25px')}>Agendar reunião</span>}
                className="custom-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: isPortrait ? 'column' : 'row',
                    marginBottom: '10px',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <DatePicker
                      style={{
                        width: isPortrait ? '70vw' : '12vw',
                        marginRight: '5px',
                        marginBottom: isPortrait ? '10px' : 0,
                      }}
                      placeholder="Selecione a data"
                      onChange={(value) => setSelectedDateForm(value?.format('YYYY-MM-DD'))}
                    ></DatePicker>
                  </div>
                  <div>
                    <Select
                      style={{ width: isPortrait ? '70vw' : '12vw' }}
                      placeholder="Selecione a hora"
                      onChange={(value) => setSelectedHour(parseInt(value.toString()))}
                    >
                      {hours.map((hour, idx) => (
                        <Select.Option key={idx} value={idx}>
                          {hour}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <Select
                    showSearch
                    loading={adminStore.clientsLoading}
                    style={{ width: isPortrait ? '70vw' : '25vw' }}
                    placeholder="Selecione o cliente"
                    onChange={(id) => setSelectedClientId(id.toString())}
                    optionFilterProp="children"
                  >
                    {adminStore.clients.map((client) => (
                      <Select.Option value={client._id} key={client.name}>
                        {client.name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    type="primary"
                    style={{ width: isPortrait ? '40vw' : '10vw' }}
                    onClick={meetHandle}
                    loading={msgraphStore.createMeetingLoading}
                  >
                    <p
                      style={{
                        color: '#fff',
                        fontFamily: 'Lato',
                      }}
                    >
                      Agendar
                    </p>
                  </Button>
                </div>
              </Card>
            </div>
            <div>
              {(selectedDate || isPortrait) && (
                <Card
                  title={isPortrait ? 'REUNIÕES AGENDADAS' : 'DETALHE DO DIA SELECIONADO'}
                  className="custom-card"
                  extra={isPortrait ? '' : `DIA ${moment(selectedDate).format('DD/MM/YYYY')}`}
                  style={{ marginTop: '5px', maxHeight: '40vh', overflowY: 'auto' }}
                >
                  <List>
                    {meetings
                      .filter((meeting) => !isPortrait || new Date(meeting.date) > new Date())
                      .map((meeting) => (
                        <List.Item key={meeting._id} className="custom-list-item">
                          {renderMeeting(meeting)}
                        </List.Item>
                      ))}
                  </List>
                </Card>
              )}
            </div>
          </div>
        </div>
      }
    />
  )
})

export default memo(MenuScreen)
