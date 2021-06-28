import { post } from './client'
import { User, Response } from '~/types'
import { PREFIX_URL } from '~/utils/consts'

const endpoint = PREFIX_URL + '/user'

export const createUser = (
  email: string,
  password: string,
  name: string,
  cpf: string,
): Promise<Response<User>> => {
  return post(`${endpoint}/create`, { email, password, name, pClient: true, cpf })
}

export const createLawyer = (
  email: string,
  password: string,
  name: string,
): Promise<Response<User>> => {
  return post(`${endpoint}/create`, { email, password, name, pClient: true, pLawyer: true })
}

export const createAdmin = (
  email: string,
  password: string,
  name: string,
): Promise<Response<User>> => {
  return post(`${endpoint}/create`, {
    email,
    password,
    name,
    pClient: true,
    pLawyer: true,
    pAdmin: true,
  })
}
