import { observable, action } from 'mobx'
import { Profile, ResponseStatus } from '~/types'
import * as profileApi from '~/services/api/profile'

class ProfileStore {
  @observable profiles: Profile[] = []
  @observable loadingProfiles = false

  @observable userProfile: Profile | undefined = undefined
  @observable loadingUserProfile = false

  @observable actionLoading = false

  @action.bound
  async loadAll() {
    this.loadingProfiles = true
    try {
      const response = await profileApi.loadAll()
      if (response.data && response.status === 200) {
        this.profiles = response.data
        this.loadingProfiles = false
        return ResponseStatus.SUCCESS
      }
      this.loadingProfiles = false
      return ResponseStatus.INTERNAL_ERROR
    } catch (error) {
      this.loadingProfiles = true
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async loadById(profileId: string) {
    this.loadingUserProfile = true
    try {
      const response = await profileApi.loadById(profileId)
      if (response.data && response.status === 200) {
        this.userProfile = response.data.pop()
        this.loadingUserProfile = false
        return ResponseStatus.SUCCESS
      }
      this.loadingUserProfile = false
      return ResponseStatus.INTERNAL_ERROR
    } catch (error) {
      this.loadingUserProfile = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async save(profile: Partial<Profile>) {
    this.actionLoading = true
    try {
      const response = await profileApi.createProfile(profile)
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
  async update(_id: string, profile: Partial<Profile>) {
    this.actionLoading = true
    try {
      const response = await profileApi.updateProfile(_id, profile)
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
      const response = await profileApi.deleteProfile(_id)
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

export default ProfileStore
