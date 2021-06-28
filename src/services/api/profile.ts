import { Response, Profile } from '~/types'
import { del, post, put } from './client'
import { PREFIX_URL } from '~/utils/consts'

const endpoint = PREFIX_URL + '/profiles'

export const loadAll = (): Promise<Response<Profile[]>> => {
  return post(`${endpoint}/getprofilebyfilter`, { filter: {} })
}

export const loadById = (_id: string): Promise<Response<Profile[]>> => {
  return post(`${endpoint}/getprofilebyfilter`, { filter: { _id } })
}

export const createProfile = (profile: Partial<Profile>): Promise<Response<Profile>> => {
  return post(`${endpoint}/createprofile`, { ...profile })
}

export const updateProfile = (
  _id: string,
  profile: Partial<Profile>,
): Promise<Response<Profile>> => {
  return put(`${endpoint}/updateprofile/${_id}`, { ...profile })
}

export const deleteProfile = (_id: string): Promise<Response<any>> => {
  return del(`${endpoint}/deleteprofile/${_id}`)
}
