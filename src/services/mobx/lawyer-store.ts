import { observable, action } from 'mobx'
import { ResponseStatus, Lawyer } from '~/types/index'
import * as lawyerApi from '../api/lawyer'

class LawyerStore {
  @observable saveLoading = false
  @observable currentLawyer: Lawyer | undefined = undefined
  @observable currentLawyerClients: Lawyer[] | undefined = undefined
  @observable lawyerInfo: Lawyer | undefined = undefined

  @action.bound
  async loadLawyer(userId: string): Promise<ResponseStatus> {
    const response = await lawyerApi.loadLawyerByUserId(userId)
    try {
      if (response.status === 200 && response.data) {
        this.currentLawyer = response.data.pop()
        return ResponseStatus.SUCCESS
      } else {
        this.currentLawyer = undefined
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async loadLawyerInfo(userId: string): Promise<ResponseStatus> {
    const response = await lawyerApi.loadLawyerById(userId)
    try {
      if (response.status === 200 && response.data) {
        this.lawyerInfo = response.data.pop()
        return ResponseStatus.SUCCESS
      } else {
        this.lawyerInfo = undefined
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async editLawyer(lawyer: any, lawyerID: string): Promise<ResponseStatus> {
    this.saveLoading = true
    const response = await lawyerApi.updateLawyer(lawyer, lawyerID)
    try {
      if (response.status === 200 && response.data) {
        this.saveLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.saveLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.saveLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }
}

export default LawyerStore
