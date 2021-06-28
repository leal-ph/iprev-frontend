import { Lawyer } from './lawyer'
import { Client } from './clients'

export interface Lawsuit {
  _id: string
  lawyer?: Lawyer
  client?: Client
  proc_number: string
  active_pole?: string
  passive_pole?: string
  government_agency?: string
  subject?: string
  court_class?: string
  notice_date?: Date
  internal_notes?: any[]
  type?: string
  status?: string
  createdAt?: Date
}

export interface NewLawsuit {
  lawyer?: Lawyer
  client?: Client
  proc_number: string
  active_pole?: string
  passive_pole?: string
  government_agency?: string
  subject?: string
  court_class?: string
  notice_date?: Date
  type?: string
  internal_notes?: any[]
  status?: string
}
