import { post, put, del } from './client'
import { Response, Lawyer } from '~/types'
import { PREFIX_URL } from '~/utils/consts'

const endpoint = PREFIX_URL

export const createLawyer = (lawyer: Lawyer): Promise<Response<Lawyer[]>> => {
  return post(`${endpoint}/lawyers/createlawyer`, lawyer)
}

export const updateLawyer = (lawyer: Lawyer, lawyerID: string): Promise<Response<Lawyer[]>> => {
  return put(`${endpoint}/lawyers/updatelawyer/${lawyerID}`, lawyer)
}

export const updateLawyerPassword = (newPassData: any, userID: string): Promise<Response<any>> => {
  return put(`${endpoint}/user/renewuserpassword/${userID}`, newPassData)
}

export const resetLawyerPassword = (userID: string, lawyerID: string): Promise<Response<any>> => {
  return put(`${endpoint}/user/resetuserpassword/${userID}`, {
    pass: '123456mudar',
    lawyerID: lawyerID,
  })
}

export const updateLawyerClients = (
  lawyerID: string,
  clients: string[],
): Promise<Response<Lawyer[]>> => {
  return put(`${endpoint}/lawyers/updatelawyer/${lawyerID}`, { clients })
}

export const loadLawyers = (): Promise<Response<Lawyer[]>> => {
  return post(`${endpoint}/lawyers/getlawyerbyfilter`, { filter: {} })
}

export const deleteLawyer = (lawyerID: string): Promise<Response<Lawyer[]>> => {
  return del(`${endpoint}/lawyers/deletelawyer/${lawyerID}`)
}

export const loadLawyerByUserId = (userId: string): Promise<Response<Lawyer[]>> => {
  return post(`${endpoint}/lawyers/getlawyerbyfilter`, { filter: { user: userId } })
}

export const loadLawyerById = (_id: string): Promise<Response<Lawyer[]>> => {
  return post(`${endpoint}/lawyers/getlawyerbyfilter`, { filter: { _id } })
}

export const loadLawyerByClientId = (clientId: string): Promise<Response<Lawyer>> => {
  return post(`${endpoint}/lawyers/getlawyerbyfilter`, { filter: { clients: { $in: clientId } } })
}
