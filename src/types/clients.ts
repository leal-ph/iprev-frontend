import { Profile } from './profile'
import { Payment } from './payment'
import { ScheduledBenefit } from './benefit'

export interface Client {
  _id: any
  name: string
  lastname: string
  fullname?: string
  cpf: string
  rg: string
  payments: Payment[]
  required_benefits?: ScheduledBenefit[]
  birthdate?: Date
  address?: string
  zipcode?: string
  city?: string
  state?: string
  telephone?: string
  email: string
  form_answers: any[]
  password?: string
  email_confirmed?: boolean
  internal_notes?: any
  finished?: boolean
  profession?: string
  marital_status?: string
  rg_consignor?: string
  user?: string
  verification_timestamp?: number
  renewpassword_timestamp?: number
  renewpassword_permission?: boolean
  createdAt: Date
}

export interface NewClient {
  user?: string
  name: string
  lastname?: string
  fullname?: string
  cpf: string
  rg: string
  camefrom?: string
  birthdate?: Date
  address?: string
  zipcode?: string
  city?: string
  state?: string
  telephone?: string
  email: string
  profile: Profile
  email_confirmed?: boolean
  internal_notes?: any
  last_token?: string
  finished?: boolean
  profession?: string
  marital_status?: string
  rg_consignor?: string
  verification_timestamp?: number
  renewpassword_timestamp?: number
  renewpassword_permission?: boolean
}
