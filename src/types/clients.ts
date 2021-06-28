import { Profile } from './profile'
import { Payment } from './payment'
import { Document } from './document'

export interface Client {
  _id: string
  user: string
  name: string
  lastname: string
  fullname?: string
  cpf: string
  rg: string
  camefrom?: string
  payments: Payment[]
  birthdate?: Date
  address?: string
  zipcode?: string
  city?: string
  state?: string
  telephone?: string
  email: string
  profile: Profile
  form_answers: any[]
  email_confirmed?: boolean
  documents: Document[]
  internal_notes?: any
  last_token?: string
  finished?: boolean
  profession?: string
  marital_status?: string
  rg_consignor?: string
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
