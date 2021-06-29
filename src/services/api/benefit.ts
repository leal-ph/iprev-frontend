import { Response, Benefit } from '~/types'
import { del, post, put } from './client'
import { PREFIX_URL } from '~/utils/consts'

const endpoint = PREFIX_URL + '/benefit'

export const loadAll = (): Promise<Response<Benefit[]>> => {
  return post(`${endpoint}/filter`, { filter: {} })
}

export const loadById = (_id: string): Promise<Response<Benefit[]>> => {
  return post(`${endpoint}/filter`, { filter: { _id } })
}

export const createBenefit = (benefit: Partial<Benefit>): Promise<Response<Benefit>> => {
  return post(`${endpoint}/create`, { ...benefit })
}

export const updateBenefit = (
  _id: string,
  benefit: Partial<Benefit>,
): Promise<Response<Benefit>> => {
  return put(`${endpoint}/update/${_id}`, { ...benefit })
}

export const deleteBenefit = (_id: string): Promise<Response<any>> => {
  return del(`${endpoint}/delete/${_id}`)
}
