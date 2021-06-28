export interface User {
  _id: string
  name: string
  email: string
  password?: string
  pLawyer?: boolean
  pClient?: boolean
  pAdmin?: boolean
  last_token?: string
  renew_permission?: boolean
  renewCryptedCode?: string
  renew_permission_timestamp?: number
  createdAt: string
}
