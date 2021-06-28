import { observable, action } from 'mobx'
import { MeetingData, TeamsUser } from '~/types'
import { ResponseStatus } from '~/types/index'

import * as msgraphApi from '../api/msgraph'

class MSGraphStore {
  @observable editMeetingsLoading = false
  @observable deleteMeetingsLoading = false
  @observable createMeetingLoading = false

  @observable users: TeamsUser[] = []
  @observable usersLoading = false

  @observable groups: any
  @observable groupsLoading = false

  @observable groupMembers: any
  @observable groupMembersLoading = false

  @observable plans: any
  @observable plansLoading = false

  @observable buckets: any
  @observable bucketsLoading = false

  @action.bound
  async editMeeting(
    eventId: string,
    lawyerTeamsId: string,
    meetId: string,
    body: MeetingData,
  ): Promise<ResponseStatus> {
    this.editMeetingsLoading = true

    const response = await msgraphApi.editMeeting(eventId, lawyerTeamsId, meetId, body)
    try {
      if (response.status === 200 && response.data) {
        this.editMeetingsLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.editMeetingsLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.editMeetingsLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async deleteMeeting(
    eventId: string,
    lawyerTeamsId: string,
    meetId: string,
  ): Promise<ResponseStatus> {
    this.deleteMeetingsLoading = true

    const response = await msgraphApi.excludeMeeting(eventId, lawyerTeamsId, meetId)
    try {
      if (response.status === 200 && response.data) {
        this.deleteMeetingsLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.deleteMeetingsLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.deleteMeetingsLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async createMeeting(
    lawyerTeamsId: string,
    userId: string,
    lawyerId: string,
    slot: number,
    body: MeetingData,
  ): Promise<ResponseStatus> {
    this.createMeetingLoading = true
    const response = await msgraphApi.scheduleMeeting(lawyerTeamsId, userId, lawyerId, slot, body)
    try {
      if (response.status === 200 && response.data) {
        this.createMeetingLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.createMeetingLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.createMeetingLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async loadUsers(): Promise<ResponseStatus> {
    this.usersLoading = true
    const response = await msgraphApi.getTeamsUsers()
    try {
      if (response.status === 200 && response.data) {
        this.users = response.data
        this.usersLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.usersLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.usersLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async getGroups(): Promise<ResponseStatus> {
    const response = await msgraphApi.getGroups()
    try {
      if (response.status === 200 && response.data) {
        this.groups = response.data
        return ResponseStatus.SUCCESS
      } else {
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.usersLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async getGroupMembers(groupId: string): Promise<ResponseStatus> {
    const response = await msgraphApi.getGroupMembers(groupId)
    try {
      if (response.status === 200 && response.data) {
        this.groupMembers = response.data
        return ResponseStatus.SUCCESS
      } else {
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.usersLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async getPlans(groupId: string): Promise<ResponseStatus> {
    const response = await msgraphApi.getPlans(groupId)
    try {
      if (response.status === 200 && response.data) {
        this.plans = response.data
        return ResponseStatus.SUCCESS
      } else {
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.usersLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async getBuckets(planId: string): Promise<ResponseStatus> {
    const response = await msgraphApi.getBuckets(planId)
    try {
      if (response.status === 200 && response.data) {
        this.buckets = response.data
        return ResponseStatus.SUCCESS
      } else {
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.usersLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async createTask(taskdata: any): Promise<ResponseStatus> {
    const response = await msgraphApi.createTask(taskdata)
    try {
      if (response.status === 200 && response.data) {
        return ResponseStatus.SUCCESS
      } else {
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.usersLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }
}

export default MSGraphStore
