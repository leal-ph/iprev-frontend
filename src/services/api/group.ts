import { post } from './client'
import { PREFIX_URL } from '~/utils/consts'
import { Response, Group } from '~/types'

const endpoint = PREFIX_URL + '/groups'

export const loadGroups = (): Promise<Response<Group[]>> => {
  return post(`${endpoint}/getgroupbyfilter`, { filter: {} })
}
