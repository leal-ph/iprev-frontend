import { observable, action } from 'mobx'
import { Meeting, CalendarResponse } from '~/types'

import * as meetingApi from '~/services/api/meet'

class MeetingStore {
  @observable meetings: Meeting[] = []
  @observable meetingsLoading = false

  @observable calendar: CalendarResponse[] = []
  @observable calendarLoading = false

  @action.bound
  async loadMeetings(clientId: string) {
    this.meetingsLoading = true
    try {
      const finalDate = new Date()
      finalDate.setDate(finalDate.getDate() + 30)

      const response = await meetingApi.loadByClient(
        clientId,
        Math.round(new Date().getTime() / 1000),
        Math.round(finalDate.getTime() / 1000),
      )

      if (response.status === 200 && response.data && Array.isArray(response.data)) {
        this.meetings = response.data
      }

      this.meetingsLoading = false
    } catch (error) {
      console.error(error)
      this.meetingsLoading = false
      this.meetings = []
    }
  }

  @action.bound
  async loadCalendar() {
    this.calendarLoading = true
    try {
      const response = await meetingApi.findCalendar()

      if (response.status === 200 && response.data) {
        this.calendar = response.data
      }

      this.calendarLoading = false
    } catch (error) {
      console.error(error)
      this.calendarLoading = false
    }
  }
}

export default MeetingStore
