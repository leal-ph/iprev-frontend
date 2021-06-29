import { observable, action } from 'mobx'
import { Benefit, ResponseStatus } from '~/types'
import * as benefitApi from '~/services/api/benefit'

class BenefitStore {
  @observable benefits: Benefit[] = []
  @observable loadingBenefits = false

  @observable userBenefit: Benefit | undefined = undefined
  @observable loadingUserBenefit = false

  @observable actionLoading = false

  @action.bound
  async loadAll() {
    this.loadingBenefits = true
    try {
      const response = await benefitApi.loadAll()
      if (response.data && response.status === 200) {
        this.benefits = response.data
        this.loadingBenefits = false
        return ResponseStatus.SUCCESS
      }
      this.loadingBenefits = false
      return ResponseStatus.INTERNAL_ERROR
    } catch (error) {
      this.loadingBenefits = true
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async loadById(profileId: string) {
    this.loadingUserBenefit = true
    try {
      const response = await benefitApi.loadById(profileId)
      if (response.data && response.status === 200) {
        this.userBenefit = response.data.pop()
        this.loadingUserBenefit = false
        return ResponseStatus.SUCCESS
      }
      this.loadingUserBenefit = false
      return ResponseStatus.INTERNAL_ERROR
    } catch (error) {
      this.loadingUserBenefit = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async save(profile: Partial<Benefit>) {
    this.actionLoading = true
    try {
      const response = await benefitApi.createBenefit(profile)
      if (response.status === 200) {
        this.actionLoading = false
        return ResponseStatus.SUCCESS
      }
      this.actionLoading = false
      return ResponseStatus.INTERNAL_ERROR
    } catch (error) {
      this.actionLoading = false
      console.error(error)
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async update(_id: string, profile: Partial<Benefit>) {
    this.actionLoading = true
    try {
      const response = await benefitApi.updateBenefit(_id, profile)
      if (response.status === 200) {
        this.loadAll()
        this.actionLoading = false
        return ResponseStatus.SUCCESS
      }
      this.actionLoading = false
      return ResponseStatus.INTERNAL_ERROR
    } catch (error) {
      console.error(error)
      this.actionLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async delete(_id: string) {
    this.actionLoading = true
    try {
      const response = await benefitApi.deleteBenefit(_id)
      if (response.status === 200) {
        this.actionLoading = false
        this.loadAll()
        return ResponseStatus.SUCCESS
      }
      this.actionLoading = false
      return ResponseStatus.INTERNAL_ERROR
    } catch (error) {
      this.actionLoading = false
      console.error(error)
      return ResponseStatus.INTERNAL_ERROR
    }
  }
}

export default BenefitStore
