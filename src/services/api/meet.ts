import { get, post } from './client'
import { Meeting, Response, CalendarResponse } from '~/types'
import { PREFIX_URL } from '~/utils/consts'

const endpoint = PREFIX_URL + '/meetings'

export const loadByClient = (
  clientId: string,
  startts: number,
  finalts: number,
): Promise<Response<Meeting[]>> => {
  return post(`${endpoint}/findusermeetings`, {
    client: clientId,
    startts: startts,
    finalts: finalts,
  })
}

export const loadByClientFuture = (clientId: string): Promise<Response<Meeting[]>> => {
  return post(`${endpoint}/findusermeetings`, {
    client: clientId,
    mode: 'future',
  })
}

export const loadByClientPast = (clientId: string): Promise<Response<Meeting[]>> => {
  return post(`${endpoint}/findusermeetings`, {
    client: clientId,
    mode: 'past',
  })
}

export const loadDailyMeetsInfo = (
  lawyerID: string,
  date: string,
): Promise<Response<Meeting[]>> => {
  return post(`${endpoint}/findDailyMeetings`, { lawyerID: lawyerID, date: date })
}

export const loadByLawyer = (lawyerId: string): Promise<Response<Meeting[]>> => {
  return post(`${endpoint}/getmeetingbyfilter`, {
    filter: {
      lawyer: lawyerId,
    },
  })
}

export const findCalendar = (): Promise<Response<CalendarResponse[]>> => {
  return get(`${endpoint}/findDisponibility`)
}

export const saveMeeting = (
  lawyerId: string,
  clientId: string,
  date: string,
  slot: number,
): Promise<Response<Meeting>> => {
  return post(`${endpoint}/createmeeting`, { lawyer: lawyerId, client: clientId, date, slot })
}
