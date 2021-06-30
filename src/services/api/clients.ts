import { get, post, put, del } from './client'
import { Client, NewClient, Response, PendingDocs } from '~/types'
import { PREFIX_URL } from '~/utils/consts'

const endpoint = PREFIX_URL

export const loadAllClients = (): Promise<Response<Client[]>> => {
  return post(`${endpoint}/users/getuserbyfilter`, { filter: { finished: true } })
}

export const loadClients = (_id: string): Promise<Response<Client[]>> => {
  return get(`${endpoint}/lawyers/getClientsList?lawyerid=${_id}`)
}

export const getPendingDocs = (_id: string): Promise<Response<PendingDocs>> => {
  return get(`${endpoint}/users/getUserDocPendings?id=${_id}`)
}

export const loadClientById = (_id: string): Promise<Response<Client[]>> => {
  return post(`${endpoint}/users/getuserbyfilter`, { filter: { _id } })
}

export const checkCPF = (cpf: string): Promise<Response<any>> => {
  return post(`${endpoint}/users/checkCPF`, { cpf: cpf })
}

export const checkRG = (rg: string): Promise<Response<any>> => {
  return post(`${endpoint}/users/checkRG`, { rg: rg })
}

export const loadClientByUserId = (userId: string): Promise<Response<Client[]>> => {
  return post(`${endpoint}/users/getuserbyfilter`, { filter: { user: userId } })
}

export const loadSelectedClientById = (_id: string): Promise<Response<Client>> => {
  return get(`${endpoint}/users/getUserById?id=${_id}`)
}

export const createNewClient = (client: NewClient): Promise<Response<Client>> => {
  return post(`${endpoint}/users/createnewclient`, client)
}

export const registerBasic = (
  email: string,
  birthdate: string,
  telephone: string,
  name: string,
  cpf: string,
  rg: string,
): Promise<Response<Client>> => {
  return post(`${endpoint}/users/createbasic`, {
    email,
    birthdate: birthdate,
    telephone,
    name,
    cpf,
    rg,
  })
}

export const updateAnswer = (userId: string, answer: any): Promise<Response<Client>> => {
  return post(`${endpoint}/users/updateform/${userId}`, { form_answers: answer })
}

export const editClient = (client: any, clientID: string): Promise<Response<Client[]>> => {
  return put(`${endpoint}/users/updateuser/${clientID}`, { ...client })
}

export const deleteClient = (clientID: string): Promise<Response<Client[]>> => {
  return del(`${endpoint}/users/deleteuser/${clientID}`)
}

export const updateAdditionalInfo = (client: Client): Promise<Response<Client>> => {
  return post(`${endpoint}/users/updateadditional/${client._id}`, { ...client })
}

export const updateBenefits = (benefitId: string, clientId: string): Promise<Response<Client>> => {
  return post(`${endpoint}/users/${clientId}/updateUserReqBenefits`, { benefitId: benefitId })
}

export const excludeBenefits = (benefitId: string, clientId: string): Promise<Response<Client>> => {
  return post(`${endpoint}/users/${clientId}/deleteUserReqBenefits`, { benefitId: benefitId })
}

export const updateClientPassword = (newPassData: any, userID: string): Promise<any> => {
  return put(`${endpoint}/user/renewuserpassword/${userID}`, newPassData)
}
