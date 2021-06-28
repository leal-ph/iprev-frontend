import { post } from './client'
import { Response, User } from '~/types'
import { PREFIX_URL } from '~/utils/consts'

const endpoint = PREFIX_URL

export const login = (
  email_cpf: string,
  password: string,
  method: string,
): Promise<Response<User>> => {
  return post(`${endpoint}/login`, { email_cpf, password, method: method })
}

export const renewpassword = (email: string) => {
  return post(`${endpoint}/users/sendrenewrequest`, { email })
}

export const renewpasswordcode = (
  email: string,
  pass: string,
  passconfirm: string,
  code: string,
) => {
  return post(`${endpoint}/user/renewpasscode`, { email, pass, passconfirm, code })
}
