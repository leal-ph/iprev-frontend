import { Client } from './clients'
import { Group } from './group'

export interface Lawyer {
  _id?: string
  name: string
  lastname?: string
  expertise?: string
  email: string
  user?: string
  clients?: Client[]
  group: Group
  teamsuserID?: string
  teamscalendarID?: string
  oab_register?: string
  last_reseted_pwd?: string
  birthdate?: string
  telephone?: string
  super_admin: boolean
  createdAt?: Date
}
