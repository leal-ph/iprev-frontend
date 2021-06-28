import { observable, action } from 'mobx'
import { Group, ResponseStatus } from '~/types'
import * as groupApi from '~/services/api/group'

class GroupStore {
  @observable groups: Group[] = []
  @observable groupsLoading = false

  @action.bound
  async loadGroups(): Promise<ResponseStatus> {
    this.groupsLoading = true
    const response = await groupApi.loadGroups()
    try {
      if (response.status === 200 && response.data) {
        this.groups = response.data
        this.groupsLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.groupsLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.groupsLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }
}

export default GroupStore
