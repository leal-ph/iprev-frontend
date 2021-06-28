import React, { memo, useEffect, useCallback, useState } from 'react'

import ClientLayout from '~/pages/GlobalLayout'
import { useHistory } from 'react-router-dom'
import {
  Layout,
  Card,
  Select,
  Form,
  Button,
  List,
  DatePicker,
  Typography,
  message,
  Alert,
} from 'antd'
import { useStores } from '~/hooks/use-stores'
import { observer } from 'mobx-react-lite'

import moment, { Moment } from 'moment'
import 'moment/locale/pt-br'
import locale from 'antd/es/date-picker/locale/pt_BR'
import { MeetingData, ResponseStatus, CalendarResponse, Meeting } from '~/types'
import {
  MSG_LAWYER_REGISTER_ERROR,
  MSG_MEETING_CREATED,
  MSG_MEETING_CREATED_ERROR,
} from '~/utils/messages'
import { checkPayed } from '~/utils/payment-utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import { useMediaQuery } from 'react-responsive'

const { Content } = Layout

const hourOptions = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

const CalendarScreen = observer(() => {
  const { meetingStore, authStore, msgraphStore, clientStore, paymentStore } = useStores()

  const history = useHistory()
  const [form] = Form.useForm()

  const [hasPermission, setHasPermission] = useState(false)
  const [canSchedule, setCanSchedule] = useState(false)
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<CalendarResponse | undefined>(
    undefined,
  )

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  const createMeeting = useCallback(() => {
    form
      .validateFields()
      .then(async () => {
        const { date, hour } = form.getFieldsValue()

        const startTime = `${date.format('YYYY-MM-DD')}T${hourOptions[hour]}`
        const endTime = `${date.format('YYYY-MM-DD')}T${hourOptions[hour].replace(':00', ':30')}:00`

        if (authStore.loggedUser && clientStore.currentUser && selectedCalendarDay) {
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
                  address: authStore.loggedUser.email,
                  name: clientStore.currentUser.name,
                },
                type: 'required',
              },
            ],
          }

          const lawyerId = selectedCalendarDay.data[hour].notAllocated.pop()

          if (lawyerId) {
            const response = await clientStore.loadCalendarLawyer(lawyerId)
            if (
              response === ResponseStatus.SUCCESS &&
              clientStore.calendarLawyer &&
              clientStore.calendarLawyer.teamsuserID
            ) {
              const lawyerMail = clientStore.calendarLawyer.email
              const lawyerName = clientStore.calendarLawyer.name

              meetingData.attendees.push({
                emailAddress: { address: lawyerMail, name: lawyerName },
                type: 'required',
              })

              const teamsId = clientStore.calendarLawyer.teamsuserID
              const userId = clientStore.currentUser._id

              const meetResponse = await msgraphStore.createMeeting(
                teamsId,
                userId,
                lawyerId,
                hour,
                meetingData,
              )

              if (meetResponse === ResponseStatus.SUCCESS) {
                message.success(MSG_MEETING_CREATED)
                meetingStore.loadMeetings(clientStore.currentUser._id)
                return
              }

              message.error(MSG_MEETING_CREATED_ERROR)
            }
          } else {
            message.error(MSG_LAWYER_REGISTER_ERROR)
          }
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }, [form, authStore.loggedUser, clientStore, meetingStore, msgraphStore, selectedCalendarDay])

  const disabledDate = useCallback(
    (date: Moment) => {
      return (
        date &&
        meetingStore.calendar.find(
          (c) => moment(c.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD'),
        ) === undefined
      )
    },
    [meetingStore.calendar],
  )

  const onDateSelect = useCallback(
    (date: Moment) => {
      if (date) {
        const calendarDay = meetingStore.calendar.find(
          (c) => moment(c.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD'),
        )
        if (calendarDay) {
          setSelectedCalendarDay(calendarDay)
        }
      }
    },
    [meetingStore.calendar],
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
          <span>{moment(meeting.date).utcOffset('+0000').format('DD-MM-YYYY HH:mm')}</span>
          <span>
            <Typography.Link href={meeting.link} target="_blank">
              Entrar na reunião
            </Typography.Link>
          </span>
        </div>
        <div>
          <span>{meeting.lawyer.name}</span>
        </div>
      </div>
    )
  }, [])

  useEffect(() => {
    if (meetingStore.meetings.length !== 0) {
      setHasPermission(true)
      if (checkPayed(paymentStore.payments)) {
        setCanSchedule(true)
      }
      return
    } else {
      setHasPermission(checkPayed(paymentStore.payments))
      setCanSchedule(checkPayed(paymentStore.payments))
      return
    }
  }, [paymentStore.payments, meetingStore.meetings])

  useEffect(() => {
    if (authStore.loggedUser) {
      clientStore.loadClient(authStore.loggedUser._id)
    }
  }, [authStore.loggedUser, clientStore])

  useEffect(() => {
    if (clientStore.currentUser) {
      meetingStore.loadMeetings(clientStore.currentUser._id)
    }
  }, [meetingStore, clientStore.currentUser])

  useEffect(() => {
    if (clientStore.currentUser) {
      paymentStore.loadClientPayments(clientStore.currentUser._id)
    }
  }, [paymentStore, clientStore.currentUser])

  useEffect(() => {
    meetingStore.loadCalendar()
  }, [meetingStore])

  return (
    <ClientLayout
      title="CALENDÁRIO DE REUNIÕES"
      onBack={() => history.push('/client/menu')}
      content={
        <Content>
          {hasPermission ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: isPortrait ? 'center' : 'flex-start',
                flexDirection: isPortrait ? 'column' : 'row',
              }}
            >
              <Card
                className="custom-card"
                title="AGENDAR REUNIÃO"
                style={{
                  width: isPortrait ? '90vw' : '40vw',
                  marginRight: isPortrait ? 0 : '2vw',
                  marginBottom: isPortrait ? '2vh' : 0,
                  height: isPortrait ? '45vh' : '60vh',
                }}
              >
                {!canSchedule && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <Alert
                      message="Área bloqueada"
                      description="Você ainda não pode agendar reuniões. Realize o pagamento dos honorários para liberar esta área!"
                      type="error"
                      showIcon
                    />
                  </div>
                )}
                <Form form={form} layout="vertical">
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: isPortrait ? 'column' : 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Form.Item
                      label="Selecione o dia:"
                      name="date"
                      key="date"
                      rules={[{ required: true, message: 'Preencha o dia.' }]}
                    >
                      <DatePicker
                        className="custom-select"
                        style={{ width: isPortrait ? '100%' : '15vw' }}
                        placeholder=""
                        locale={locale}
                        disabledDate={disabledDate}
                        onChange={(value) => {
                          form.setFieldsValue({ date: moment(value, 'YYYY-MM-DD') })
                          onDateSelect(moment(value, 'YYYY-MM-DD'))
                        }}
                        disabled={!canSchedule}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Selecione o Horário:"
                      name="hour"
                      key="hour"
                      rules={[{ required: true, message: 'Preencha o horário.' }]}
                    >
                      <Select
                        className="custom-select"
                        style={{ width: isPortrait ? '100%' : '15vw' }}
                        onChange={(value) => form.setFieldsValue({ hour: value })}
                        disabled={!canSchedule}
                      >
                        {selectedCalendarDay &&
                          selectedCalendarDay.data.map((d, idx) => (
                            <Select.Option value={idx} key={idx} disabled={!d.free}>
                              {hourOptions[idx]}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </div>
                </Form>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    type="primary"
                    style={{ width: isPortrait ? '40vw' : '20vw' }}
                    onClick={() => createMeeting()}
                    loading={msgraphStore.createMeetingLoading}
                    disabled={!canSchedule}
                  >
                    AGENDAR
                  </Button>
                </div>
              </Card>
              <Card
                className="custom-card"
                title="REUNIÕES MARCADAS"
                style={{
                  width: isPortrait ? '90vw' : '40vw',
                  height: '60vh',
                  overflowY: 'auto',
                  marginBottom: isPortrait ? '2vh' : 0,
                }}
              >
                <List loading={meetingStore.meetingsLoading}>
                  {meetingStore.meetings.map((meeting) => (
                    <List.Item className="custom-list-item" key={meeting._id}>
                      {renderMeeting(meeting)}
                    </List.Item>
                  ))}
                </List>
              </Card>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Card
                className="custom-card"
                style={{ width: isPortrait ? '90vw' : '40vw', marginBottom: '5vh' }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <span
                    style={{
                      fontWeight: 'bold',
                      marginBottom: '10px',
                      width: '20vw',
                      textAlign: 'center',
                    }}
                  >
                    Você ainda não tem acesso a este recurso pois não pagou os honorários.
                  </span>
                  <FontAwesomeIcon icon={faTimesCircle} size="5x" style={{ color: 'red' }} />
                </div>
              </Card>
            </div>
          )}
        </Content>
      }
    />
  )
})

export default memo(CalendarScreen)
