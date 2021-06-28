import { User } from '~/types'

export const hasClient = (user: User | undefined) => {
  if (!user) {
    return false
  }

  return user.pClient ? true : false
}

export const hasLawyer = (user: User | undefined) => {
  if (!user) {
    return false
  }

  return user.pLawyer ? true : false
}

export const hasAdmin = (user: User | undefined) => {
  if (!user) {
    return false
  }

  return user.pAdmin ? true : false
}
