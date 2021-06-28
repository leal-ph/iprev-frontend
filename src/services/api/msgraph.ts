import { get, post, del } from './client'
import { Response, MeetingData, Meeting, TeamsUser } from '~/types'

const endpoint = '/msgraph'

export const editMeeting = (
  eventId: string,
  lawyerTeamsId: string,
  meetId: string,
  body: MeetingData,
): Promise<Response<any>> => {
  return post(`${endpoint}/meetings/reschedule/${eventId}/${lawyerTeamsId}/${meetId}`, { ...body })
}

export const excludeMeeting = (
  eventId: string,
  lawyerTeamsId: string,
  meetId: string,
): Promise<Response<any>> => {
  return del(`${endpoint}/meet/exclude/${eventId}/${lawyerTeamsId}/${meetId}`)
}

export const scheduleMeeting = (
  lawyerTeamsId: string,
  userId: string,
  lawyerId: string,
  slot: number,
  body: MeetingData,
): Promise<Response<Meeting>> => {
  return post(`${endpoint}/meet/schedule/${lawyerTeamsId}/${userId}/${lawyerId}/${slot}`, {
    ...body,
  })
}

export const createTask = (taskdata: any): Promise<Response<Meeting>> => {
  return post(`${endpoint}/planner/tasks/create`, taskdata)
}

export const getGroups = (): Promise<Response<any>> => {
  return get(`${endpoint}/planner/groups`)
}

export const getGroupMembers = (groupId: string): Promise<Response<any>> => {
  return get(`${endpoint}/planner/groups/members/${groupId}`)
}

export const getPlans = (groupId: string): Promise<Response<any>> => {
  return get(`${endpoint}/planner/plans/group/${groupId}`)
}

export const getBuckets = (planId: string): Promise<Response<any>> => {
  return get(`${endpoint}/planner/plans/buckets/${planId}`)
}

export const getTeamsUsers = (): Promise<Response<TeamsUser[]>> => {
  return get(`${endpoint}/user/list`)
}
