import { observable, action } from 'mobx'
import {
  Meeting,
  Client,
  Lawyer,
  NewLawsuit,
  Payment,
  Document,
  InternalNote,
  Lawsuit,
} from '~/types'
import { ResponseStatus } from '~/types/index'
import { displayMoment } from '~/utils/date-utils'
import moment from 'moment'

import * as meetApi from '../api/meet'
import * as clientApi from '../api/clients'
import * as docApi from '../api/document'
import * as lawsuitApi from '../api/lawsuit'
import * as paymentApi from '../api/payment'
import * as lawyerApi from '../api/lawyer'
import * as userApi from '../api/user'
// import { create } from 'domain'

class AdminStore {
  // Dados gerais
  @observable meetings: Meeting[] = []
  @observable meetingsLoading = false
  @observable clientMeetings: Meeting[] = []
  @observable clientMeetingsLoading = false
  @observable clientDocuments: Document[] = []
  @observable clientDocumentsLoading = false
  @observable signedDocuments: Document[] = []
  @observable signedDocumentsLoading = false
  @observable dailyMeetings: Meeting[] = []
  @observable dailyMeetingsLoading = false
  @observable clients: Client[] = []
  @observable clientsLoading = false

  // Dados do cliente selecionado na tela administrativa
  @observable selectedClient: Client | undefined = undefined
  @observable selectedClientLoading = false
  @observable payments: Payment[] = []
  @observable paymentsLoading = false
  @observable docs: Document[] = []
  @observable docsLoading = false

  // Dados para super admin
  @observable lawyers: Lawyer[] = []
  @observable lawyersLoading = false
  @observable selectedLawyer: Lawyer | undefined = undefined
  @observable selectedLawyerLoading = false
  @observable deletedLawsuit = ''
  @observable deletedLawsuitLoading = false
  @observable deletedClient = ''
  @observable deletedClientLoading = false
  @observable deletedLawsuitIN: Lawsuit | undefined
  @observable deletedLawsuitINLoading = false
  @observable updatedLawsuitIN: Lawsuit | undefined
  @observable updatedLawsuitINLoading = false
  @observable deletedPaymentLoading = false
  @observable deletedPayment = ''

  // Ações
  @action.bound
  async loadMeetings(lawyerId: string): Promise<ResponseStatus> {
    this.meetingsLoading = true
    const response = await meetApi.loadByLawyer(lawyerId)
    try {
      if (response.status === 200 && response.data) {
        this.meetings = response.data
        this.meetingsLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.meetings = []
        this.meetingsLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.meetings = []
      this.meetingsLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async loadDailyMeetsInfo(lawyerID: string, date: string): Promise<ResponseStatus> {
    this.dailyMeetingsLoading = true
    const response = await meetApi.loadDailyMeetsInfo(lawyerID, date)
    try {
      if (response.status === 200 && response.data) {
        this.dailyMeetings = response.data
        this.dailyMeetingsLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.dailyMeetings = []
        this.dailyMeetingsLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.dailyMeetings = []
      this.dailyMeetingsLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async loadClients(lawyerId: string, superAdmin: boolean): Promise<ResponseStatus> {
    this.clientsLoading = true

    const response = superAdmin
      ? await clientApi.loadAllClients()
      : await clientApi.loadClients(lawyerId)

    try {
      if (response.status === 200 && response.data) {
        this.clients = response.data
        this.clientsLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.clients = []
        this.clientsLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.clients = []
      this.clientsLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async loadSelectedClient(_id: string): Promise<ResponseStatus> {
    this.selectedClientLoading = true

    const response = await clientApi.loadClientById(_id)
    try {
      if (response.status === 200 && response.data) {
        this.selectedClient = response.data.pop()
        this.selectedClientLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.selectedClient = undefined
        this.selectedClientLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.selectedClient = undefined
      this.selectedClientLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async loadClientPayments(clientId: string): Promise<ResponseStatus> {
    this.paymentsLoading = true

    const response = await paymentApi.loadPaymentsByClientId(clientId)
    try {
      if (response.status === 200 && response.data) {
        this.payments = response.data
        this.paymentsLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.payments = []
        this.paymentsLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.payments = []
      this.paymentsLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async loadClientDocuments(clientId: string): Promise<ResponseStatus> {
    this.clientDocumentsLoading = true

    const response = await docApi.loadClientDocs(clientId)
    try {
      if (response.status === 200 && response.data) {
        this.clientDocuments = response.data
        this.clientDocumentsLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.clientDocuments = []
        this.clientDocumentsLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.clientDocuments = []
      this.clientDocumentsLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async loadLawyers(): Promise<ResponseStatus> {
    this.lawyersLoading = true

    const response = await lawyerApi.loadLawyers()
    try {
      if (response.status === 200 && response.data) {
        this.lawyers = response.data
        this.lawyersLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.lawyers = []
        this.lawyersLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.lawyers = []
      this.lawyersLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async loadSelectedLawyer(_id: string): Promise<ResponseStatus> {
    this.selectedLawyerLoading = true

    const response = await lawyerApi.loadLawyerById(_id)
    try {
      if (response.status === 200 && response.data) {
        this.selectedLawyer = response.data.pop()
        this.selectedLawyerLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.selectedLawyer = undefined
        this.selectedLawyerLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.selectedLawyer = undefined
      this.selectedLawyerLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async registerLawyer(
    lawyer: Lawyer,
    password: string,
    createAdmin: boolean,
  ): Promise<ResponseStatus> {
    try {
      const newUser = createAdmin
        ? await userApi.createAdmin(lawyer.email, password, lawyer.name)
        : await userApi.createLawyer(lawyer.email, password, lawyer.name)
      if (newUser.status === 200 && newUser.data) {
        lawyer.user = newUser.data._id
        const response = await lawyerApi.createLawyer(lawyer)
        if (response.status === 200 && response.data) {
          return ResponseStatus.SUCCESS
        }
      }
      return ResponseStatus.INTERNAL_ERROR
    } catch {
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async deleteLawyer(lawyerID: string): Promise<ResponseStatus> {
    const response = await lawyerApi.deleteLawyer(lawyerID)
    try {
      if (response.status === 200 && response.data) {
        return ResponseStatus.SUCCESS
      } else {
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async deleteClient(clientID: string): Promise<ResponseStatus> {
    this.deletedClientLoading = true
    const response = await clientApi.deleteClient(clientID)
    try {
      if (response.status === 200 && response.data) {
        this.deletedClient = clientID
        this.deletedClientLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.deletedClient = ''
        this.deletedClientLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.deletedClient = ''
      this.deletedClientLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async updateLawyer(lawyer: any, lawyerID: string): Promise<ResponseStatus> {
    const response = await lawyerApi.updateLawyer(lawyer, lawyerID)
    try {
      if (response.status === 200 && response.data) {
        return ResponseStatus.SUCCESS
      } else {
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async updateLawyerPassword(newPassData: any, lawyerID: string): Promise<ResponseStatus> {
    const response = await lawyerApi.updateLawyerPassword(newPassData, lawyerID)
    try {
      if (response.status === 200 && response.data) {
        return ResponseStatus.SUCCESS
      } else if (response.status === 400) {
        return ResponseStatus.UNAUTHORIZED
      } else {
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async resetLawyerPassword(lawyerUserID: string, lawyerID: string): Promise<ResponseStatus> {
    const response = await lawyerApi.resetLawyerPassword(lawyerUserID, lawyerID)
    try {
      if (response.status === 200 && response.data) {
        return ResponseStatus.SUCCESS
      } else if (response.status === 400) {
        return ResponseStatus.UNAUTHORIZED
      } else {
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async updateClientPassword(newPassData: any, userID: string): Promise<ResponseStatus> {
    const response = await clientApi.updateClientPassword(newPassData, userID)
    try {
      if (response.status === 200 && response.data) {
        return ResponseStatus.SUCCESS
      } else if (response.status === 400) {
        return ResponseStatus.UNAUTHORIZED
      } else {
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async updateLawyerClients(lawyerId: string, clients: string[]): Promise<ResponseStatus> {
    const response = await lawyerApi.updateLawyerClients(lawyerId, clients)
    try {
      if (response.status === 200 && response.data) {
        return ResponseStatus.SUCCESS
      } else {
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async loadAllDocuments(): Promise<ResponseStatus> {
    this.docsLoading = true

    const response = await docApi.loadDocs()
    try {
      if (response.status === 200 && response.data) {
        this.docs = response.data
        this.docsLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.docs = []
        this.docsLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.docs = []
      this.docsLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async loadSignedDocuments(): Promise<ResponseStatus> {
    this.signedDocumentsLoading = true

    const response = await docApi.loadAllSignedDocs()
    try {
      if (response.status === 200 && response.data) {
        this.signedDocuments = response.data
        this.signedDocumentsLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.signedDocuments = []
        this.signedDocumentsLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.signedDocuments = []
      this.signedDocumentsLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async deletePayment(payment_id: string, user_id: string): Promise<ResponseStatus> {
    this.deletedPaymentLoading = true

    const response = await paymentApi.deletePayment(payment_id, user_id)
    try {
      if (response.status === 200 && response.data) {
        this.deletedPayment = payment_id
        this.deletedPaymentLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.deletedPayment = ''
        this.deletedPaymentLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.deletedPayment = ''
      this.deletedPaymentLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async registerLawsuit(lawsuit: NewLawsuit): Promise<ResponseStatus> {
    try {
      const response = await lawsuitApi.createLawsuit(lawsuit)
      if (response.status === 200 && response.data) {
        return ResponseStatus.SUCCESS
      } else {
        return ResponseStatus.UPLOAD_FAILED
      }
    } catch (error) {
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async deleteLawsuit(lawsuit_id: string): Promise<ResponseStatus> {
    this.deletedLawsuitLoading = true

    const response = await lawsuitApi.deleteLawsuit(lawsuit_id)
    try {
      if (response.status === 200 && response.data) {
        this.deletedLawsuit = lawsuit_id
        this.deletedLawsuitLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.deletedLawsuit = ''
        this.deletedLawsuitLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.deletedLawsuit = ''
      this.deletedLawsuitLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async updateLawsuitInternalNote(
    text: string,
    lawsuit_id: string,
    isPrivate: boolean,
    lawyer: string,
  ): Promise<ResponseStatus> {
    const note: InternalNote = {
      info: text,
      date: displayMoment(moment(new Date())).toString(),
      isPrivate: isPrivate,
      lawyer: lawyer,
    }

    const response = await lawsuitApi.updateLawsuitInternalNotes(note, lawsuit_id)
    try {
      if (response.status === 200 && response.data) {
        this.updatedLawsuitIN = response.data
        this.updatedLawsuitINLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.updatedLawsuitIN = undefined
        this.updatedLawsuitINLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.updatedLawsuitIN = undefined
      this.updatedLawsuitINLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  async deleteLawsuitInternalNote(note: InternalNote, lawsuit_id: string): Promise<ResponseStatus> {
    const response = await lawsuitApi.deleteLawsuitInternalNotes(note, lawsuit_id)
    try {
      if (response.status === 200 && response.data) {
        this.deletedLawsuitIN = response.data
        this.deletedLawsuitINLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.deletedLawsuitIN = undefined
        this.deletedLawsuitINLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.deletedLawsuitIN = undefined
      this.deletedLawsuitINLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }
}

export default AdminStore
