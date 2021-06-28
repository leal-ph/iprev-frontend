import { Lawyer } from './lawyer'
import { Client } from './clients'

export interface Meeting {
  _id: string
  lawyer: Lawyer
  client: Client
  date: Date
  date_ts?: number
  link?: string
  id_teams?: string
  informations?: any
  slot: number
  createdAt: Date
}

export interface MeetingDateTime {
  dateTime: string
  timeZone: string
}

export interface MeetingAttendees {
  emailAddress: { address: string; name: string }
  type: string
}

export interface MeetingData {
  start: MeetingDateTime
  end: MeetingDateTime
  attendees: MeetingAttendees[]
}

export interface TeamsUser {
  businessPhones: string[]
  displayName: string
  givenName: string
  jobTitle: string
  mail: string
  mobilePhone: string
  officeLocation: string
  preferredLanguage: string
  surname: string
  userPrincipalName: string
  id: string
}

export interface CalendarResponse {
  date: string
  data: [
    {
      free: boolean
      allocated: string[]
      notAllocated: string[]
    },
  ]
}
