import { Lawsuit, NewLawsuit, Response, InternalNote } from '~/types'
import { post, put, del } from './client'
import { PREFIX_URL } from '~/utils/consts'

const endpoint = PREFIX_URL + '/processes'

export const loadLawsuitByClientId = (clientId: string): Promise<Response<Lawsuit[]>> => {
  return post(`${endpoint}/getprocessbyfilter`, { filter: { client: clientId } })
}

export const loadAllLawsuits = (): Promise<Response<Lawsuit[]>> => {
  return post(`${endpoint}/getprocessbyfilter`, { filter: {} })
}

export const updateLawsuit = (
  lawsuit: Lawsuit,
  lawsuitID: string,
): Promise<Response<Lawsuit[]>> => {
  return put(`${endpoint}/updateprocess/${lawsuitID}`, lawsuit)
}

export const updateLawsuitInternalNotes = (
  note: InternalNote,
  lawsuitID: string,
): Promise<Response<Lawsuit>> => {
  return put(`${endpoint}/updateInternalNote/${lawsuitID}`, { note: note })
}

export const deleteLawsuitInternalNotes = (
  note: InternalNote,
  lawsuitID: string,
): Promise<Response<Lawsuit>> => {
  return put(`${endpoint}/deleteInternalNote/${lawsuitID}`, { note: note })
}

export const loadLawsuitById = (_id: string): Promise<Response<Lawsuit[]>> => {
  return post(`${endpoint}/getprocessbyfilter`, { filter: { _id } })
}

export const createLawsuit = (lawsuit: NewLawsuit): Promise<Response<Lawsuit>> => {
  return post(`${endpoint}/createprocess`, lawsuit)
}

export const deleteLawsuit = (lawyerID: string): Promise<Response<Lawsuit[]>> => {
  return del(`${endpoint}/deleteprocess/${lawyerID}`)
}
