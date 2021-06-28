import { observable, action } from 'mobx'
import { Meeting } from '~/types'
import { ResponseStatus } from '~/types/index'

import * as meetApi from '../api/meet'

class MeetStore {
  @observable clientMeetings: Meeting[] = []
  @observable clientMeetingsLoading = false

  @observable clientPastMeetings: Meeting[] = []
  @observable clientPastMeetingsLoading = false

  @action.bound
  async loadClientFutureMeetings(clientId: string): Promise<ResponseStatus> {
    this.clientMeetingsLoading = true

    const response = await meetApi.loadByClientFuture(clientId)
    try {
      if (response.status === 200 && response.data) {
        this.clientMeetings = response.data
        this.clientMeetingsLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.clientMeetings = []
        this.clientMeetingsLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.clientMeetings = []
      this.clientMeetingsLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  async loadClientPastMeetings(clientId: string): Promise<ResponseStatus> {
    this.clientMeetingsLoading = true

    const response = await meetApi.loadByClientPast(clientId)
    try {
      if (response.status === 200 && response.data) {
        this.clientPastMeetings = response.data
        this.clientPastMeetingsLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.clientPastMeetings = []
        this.clientPastMeetingsLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.clientPastMeetings = []
      this.clientPastMeetingsLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }
}

export default MeetStore
