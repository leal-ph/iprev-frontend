import { observable, action } from 'mobx'
import { create, persist } from 'mobx-persist'
import { User } from '~/types/index'
import * as authApi from '../api/auth'
import { login, logout, USER_KEY, getUser } from '../storage/auth'
import { ResponseStatus } from '~/types/index'

class AuthStore {
  @observable loginLoading = false
  @persist('object') @observable loggedUser: User | undefined = undefined
  @observable renewResponse = false

  constructor() {
    const storageUser = getUser()
    if (storageUser) {
      this.loggedUser = JSON.parse(storageUser).loggedUser
    }
  }

  @action.bound
  async login(email: string, password: string, method: string): Promise<ResponseStatus> {
    this.loginLoading = true
    const response = await authApi.login(email, password, method)
    try {
      if (response.status === 200) {
        this.loggedUser = response.data
        this.loginLoading = false
        if (this.loggedUser?.last_token) {
          login(this.loggedUser.last_token)
        }
        return ResponseStatus.SUCCESS
      } else if (response.status === 401) {
        this.loggedUser = undefined
        this.loginLoading = false
        return ResponseStatus.WRONG_PASSWORD
      } else if (response.status === 404) {
        this.loggedUser = undefined
        this.loginLoading = false
        return ResponseStatus.USER_NOT_FOUND
      } else {
        this.loggedUser = undefined
        this.loginLoading = false
        logout()
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.loggedUser = undefined
      this.loginLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  logout(): ResponseStatus {
    this.loggedUser = undefined
    logout()
    return ResponseStatus.SUCCESS
  }

  @action.bound
  async renewPassword(email: string): Promise<ResponseStatus> {
    this.loginLoading = true
    try {
      const response = await authApi.renewpassword(email)
      if (response.status === 200) {
        // this.renewResponse = response.data
        return ResponseStatus.SUCCESS
      } else if (response.status === 404) {
        return ResponseStatus.USER_NOT_FOUND
      } else {
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch (err) {
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async renewPasswordCode(
    email: string,
    pass: string,
    passconfirm: string,
    code: string,
  ): Promise<ResponseStatus> {
    this.loginLoading = true
    try {
      const response = await authApi.renewpasswordcode(email, pass, passconfirm, code)
      if (response.status === 200) {
        return ResponseStatus.SUCCESS
      } else if (response.status === 460) {
        return ResponseStatus.INVALID_CODE
      } else if (response.status === 461) {
        return ResponseStatus.NO_RENEW_PERMISSION
      } else if (response.status === 462) {
        return ResponseStatus.EXPIRED_CODE
      } else {
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch (err) {
      return ResponseStatus.INTERNAL_ERROR
    }
  }
}

const hydrate = create({
  storage: localStorage,
  jsonify: true,
  debounce: 1000,
})

export const authStore = new AuthStore()
hydrate(USER_KEY, authStore)

export default authStore
