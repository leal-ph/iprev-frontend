import { Client, Lawyer } from '~/types'

export const isClient = (user: Client | Lawyer): boolean => {
  if ((user as Lawyer).expertise) {
    return false
  }
  return true
}
