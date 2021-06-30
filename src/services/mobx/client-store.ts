import { observable, action } from 'mobx'
import { Client, NewClient, ResponseStatus, Lawyer, PendingDocs } from '~/types/index'
import * as clientApi from '../api/clients'
import * as lawyerApi from '../api/lawyer'
import * as userApi from '../api/user'

class ClientStore {
  @observable saveLoading = false

  @observable currentUser: Client | undefined = undefined

  @observable currentUserLawyer: Lawyer | undefined = undefined

  @observable clientPendingDocs: PendingDocs | undefined = undefined

  @observable calendarLawyer: Lawyer | undefined = undefined

  @observable clientInfo: Client | undefined = undefined

  @action.bound
  async loadClient(userId: string): Promise<ResponseStatus> {
    const response = await clientApi.loadClientByUserId(userId)
    try {
      if (response.status === 200 && response.data) {
        this.currentUser = response.data.pop()
        return ResponseStatus.SUCCESS
      } else {
        this.currentUser = undefined
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async loadClientInfo(userId: string): Promise<ResponseStatus> {
    const response = await clientApi.loadSelectedClientById(userId)
    try {
      if (response.status === 200 && response.data) {
        this.clientInfo = response.data
        return ResponseStatus.SUCCESS
      } else {
        this.clientInfo = undefined
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async loadClientLawyer(): Promise<ResponseStatus> {
    if (this.currentUser) {
      const response = await lawyerApi.loadLawyerByClientId(this.currentUser._id)
      try {
        if (response.status === 200) {
          this.currentUserLawyer = response.data
          return ResponseStatus.SUCCESS
        } else {
          this.currentUserLawyer = undefined
          return ResponseStatus.INTERNAL_ERROR
        }
      } catch {
        this.currentUserLawyer = undefined
        return ResponseStatus.INTERNAL_ERROR
      }
    }
    return ResponseStatus.USER_NOT_LOADED
  }

  @action.bound
  async loadCalendarLawyer(lawyerId: string): Promise<ResponseStatus> {
    if (this.currentUser) {
      const response = await lawyerApi.loadLawyerById(lawyerId)
      try {
        if (response.status === 200 && response.data && response.data.length > 0) {
          this.calendarLawyer = response.data.pop()
          return ResponseStatus.SUCCESS
        } else {
          this.currentUserLawyer = undefined
          return ResponseStatus.INTERNAL_ERROR
        }
      } catch {
        this.currentUserLawyer = undefined
        return ResponseStatus.INTERNAL_ERROR
      }
    }
    return ResponseStatus.USER_NOT_LOADED
  }

  @action.bound
  async loadClientPendingDocs(userId: string): Promise<ResponseStatus> {
    const response = await clientApi.getPendingDocs(userId)
    try {
      if (response.status === 200) {
        this.clientPendingDocs = response.data
        return ResponseStatus.SUCCESS
      } else {
        this.clientPendingDocs = undefined
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.clientPendingDocs = undefined
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async saveBasic(
    email: string,
    birthdate: string,
    telephone: string,
    name: string,
    cpf: string,
    rg: string,
  ): Promise<ResponseStatus> {
    this.saveLoading = true
    const response = await clientApi.registerBasic(email, birthdate, telephone, name, cpf, rg)
    try {
      if (response.status === 200) {
        this.currentUser = response.data
        this.saveLoading = false
        return ResponseStatus.SUCCESS
      } else if (response.status === 512) {
        this.currentUser = response.data
        this.saveLoading = false
        return ResponseStatus.DUPLICATE_REGISTER
      } else if (response.status === 513) {
        this.currentUser = response.data
        this.saveLoading = false
        return ResponseStatus.DUPLICATE_REGISTER_EXISTS_AS_LAWYER
      } else {
        this.currentUser = undefined
        this.saveLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async updateAnswer(answer: any): Promise<ResponseStatus> {
    this.saveLoading = true
    if (this.currentUser) {
      const response = await clientApi.updateAnswer(this.currentUser._id, answer)
      try {
        if (response.status === 200) {
          this.currentUser = response.data
          this.saveLoading = false
          return ResponseStatus.SUCCESS
        } else {
          this.currentUser = undefined
          this.saveLoading = false
          return ResponseStatus.INTERNAL_ERROR
        }
      } catch {
        return ResponseStatus.INTERNAL_ERROR
      }
    } else {
      return ResponseStatus.CLIENT_UNDEFINED
    }
  }

  @action.bound
  async verifyCPFExists(cpf: string): Promise<ResponseStatus> {
    const response = await clientApi.checkCPF(cpf)

    if (response.data.exists) {
      return ResponseStatus.DUPLICATE_REGISTER_CPF
    } else {
      return ResponseStatus.SUCCESS
    }
  }

  @action.bound
  async verifyRGExists(rg: string): Promise<ResponseStatus> {
    const response = await clientApi.checkRG(rg)

    if (response.data.exists) {
      return ResponseStatus.DUPLICATE_REGISTER_RG
    } else {
      return ResponseStatus.SUCCESS
    }
  }

  @action.bound
  async updateBenefits(benefitId: string, clientId: string): Promise<ResponseStatus> {
    this.saveLoading = true

    const response = await clientApi.updateBenefits(benefitId, clientId)
    try {
      if (response.status === 200) {
        this.saveLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.saveLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async updateBenefitStatus(
    benefitId: string,
    clientId: string,
    newStatus: string,
    date: Date,
  ): Promise<ResponseStatus> {
    this.saveLoading = true

    const response = await clientApi.updateBenefitStatus(benefitId, clientId, newStatus, date)
    try {
      if (response.status === 200) {
        this.saveLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.saveLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async excludeBenefits(benefitId: string, clientId: string): Promise<ResponseStatus> {
    this.saveLoading = true

    const response = await clientApi.excludeBenefits(benefitId, clientId)
    try {
      if (response.status === 200) {
        this.saveLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.saveLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async updateAdditionalInfo(
    cpf: string,
    rg: string,
    cep: string,
    state: string,
    city: string,
    address: string,
    profession: string,
    marital_status: string,
    password: string,
    rg_consignor: string,
    finished: boolean,
  ): Promise<ResponseStatus> {
    this.saveLoading = true
    const client = this.currentUser

    if (client) {
      client.cpf = cpf
      client.rg = rg
      client.zipcode = cep
      client.state = state
      client.city = city
      client.profession = profession
      client.marital_status = marital_status
      client.address = address
      client.finished = finished
      client.rg_consignor = rg_consignor
      try {
        const newUser = await userApi.createUser(client.email, password, client.name, client.cpf)
        if (newUser.status === 200 && newUser.data) {
          client.user = newUser.data._id
          const response = await clientApi.updateAdditionalInfo(client)
          if (response.status === 200) {
            this.currentUser = response.data
            this.saveLoading = false
            return ResponseStatus.SUCCESS
          } else if (response.status === 512) {
            this.saveLoading = false
            return ResponseStatus.DUPLICATE_REGISTER_CPF
          } else if (response.status === 513) {
            this.saveLoading = false
            return ResponseStatus.DUPLICATE_REGISTER_RG
          }
        } else {
          this.saveLoading = false
          return ResponseStatus.INTERNAL_ERROR
        }
      } catch (error) {
        this.saveLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    }

    return ResponseStatus.CLIENT_UNDEFINED
  }

  @action.bound
  async createNewClient(newClient: NewClient, password: string): Promise<ResponseStatus> {
    this.saveLoading = true

    if (newClient) {
      try {
        const newUser = await userApi.createUser(
          newClient.email,
          password!,
          newClient.name,
          newClient.cpf,
        )
        if (newUser.status === 514) {
          this.saveLoading = false
          return ResponseStatus.DUPLICATE_REGISTER
        }

        if (newUser.status === 200 && newUser.data) {
          newClient.user = newUser.data._id
          const response = await clientApi.createNewClient(newClient)
          if (response.status === 200) {
            this.currentUser = response.data
            this.saveLoading = false
            return ResponseStatus.SUCCESS
          } else if (response.status === 512) {
            this.saveLoading = false
            return ResponseStatus.DUPLICATE_REGISTER_CPF
          } else if (response.status === 513) {
            this.saveLoading = false
            return ResponseStatus.DUPLICATE_REGISTER_RG
          } else if (response.status === 514) {
            this.saveLoading = false
            return ResponseStatus.DUPLICATE_REGISTER
          }
        } else {
          this.saveLoading = false
          return ResponseStatus.INTERNAL_ERROR
        }
      } catch (error) {
        this.saveLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    }

    return ResponseStatus.CLIENT_UNDEFINED
  }

  @action.bound
  async editUser(client: any, clientID: string): Promise<ResponseStatus> {
    this.saveLoading = true
    const response = await clientApi.editClient(client, clientID)
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

export default ClientStore
