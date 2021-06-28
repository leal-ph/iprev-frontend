import { action, observable } from 'mobx'
import { ResponseStatus, Lawsuit, NewLawsuit } from '~/types'

import * as lawsuitApi from '~/services/api/lawsuit'
import * as mailApi from '~/services/api/mail'

class LawsuitStore {
  @observable lawsuits: Lawsuit[] = []
  @observable lawsuitsLoading = false
  @observable editLawsuitsLoading = false
  @observable newLawsuit: Lawsuit | undefined = undefined
  @observable newLawsuitLoading = false
  @observable allLawsuits: Lawsuit[] = []
  @observable allLawsuitsLoading = false
  @observable selectedLawsuit: Lawsuit | undefined = undefined
  @observable selectedLawsuitLoading = false
  @observable sendMail: any
  @observable sendMailLoading = false

  @action.bound
  async loadClientLawsuits(clientId: string): Promise<ResponseStatus> {
    this.lawsuitsLoading = true

    const response = await lawsuitApi.loadLawsuitByClientId(clientId)
    try {
      if (response.status === 200 && response.data) {
        this.lawsuits = response.data
        this.lawsuitsLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.lawsuits = []
        this.lawsuitsLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async createLawsuit(lawsuit: NewLawsuit): Promise<ResponseStatus> {
    this.lawsuitsLoading = true

    const response = await lawsuitApi.createLawsuit(lawsuit)
    try {
      if (response.status === 200 && response.data) {
        this.newLawsuit = response.data
        this.newLawsuitLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.newLawsuit = undefined
        this.newLawsuitLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async loadAllLawsuits(): Promise<ResponseStatus> {
    this.allLawsuitsLoading = true

    const response = await lawsuitApi.loadAllLawsuits()
    try {
      if (response.status === 200 && response.data) {
        this.allLawsuits = response.data
        this.allLawsuitsLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.allLawsuits = []
        this.allLawsuitsLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async sendMailNotification(
    email: string,
    clientName: string,
    lawyerName: string,
    lawsuitCode: string,
    content: string,
    isLinkNotification: boolean,
  ): Promise<ResponseStatus> {
    this.sendMailLoading = true

    const response = await mailApi.sendNotificationMail(
      email,
      clientName,
      lawyerName,
      lawsuitCode,
      content,
      isLinkNotification,
    )
    try {
      if (response.status === 200 && response.data) {
        this.sendMail = response.data
        this.sendMailLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.sendMail = []
        this.sendMailLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async editLawsuit(lawsuit: any, lawsuit_id: string): Promise<ResponseStatus> {
    this.editLawsuitsLoading = true
    const response = await lawsuitApi.updateLawsuit(lawsuit, lawsuit_id)
    try {
      if (response.status === 200 && response.data) {
        this.editLawsuitsLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.editLawsuitsLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.editLawsuitsLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async loadSelectedLawsuit(_id: string): Promise<ResponseStatus> {
    this.selectedLawsuitLoading = true

    const response = await lawsuitApi.loadLawsuitById(_id)
    try {
      if (response.status === 200 && response.data) {
        this.selectedLawsuit = response.data.pop()
        this.selectedLawsuitLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.selectedLawsuit = undefined
        this.selectedLawsuitLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.selectedLawsuit = undefined
      this.selectedLawsuitLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }
}

export default LawsuitStore
