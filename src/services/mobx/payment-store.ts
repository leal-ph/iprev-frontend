import { action, observable } from 'mobx'
import { Payment, PaymentPayer, PaymentItem, ResponseStatus } from '~/types'
import * as paymentApi from '~/services/api/payment'

class PaymentStore {
  @observable pendingPayments: Payment[] = []
  @observable pendingPaymentsLoading = false

  @observable creditCardPaymentLoading = false
  @observable bankSlipPaymentLoading = false

  @observable payments: Payment[] = []
  @observable paymentsLoading = false

  // @observable placeholder: Payment
  @observable placeholderLoading = false
  @observable placeholders: Payment[] = []

  @action.bound
  async generatePlaceHolder(userId: string, payment: Payment): Promise<Payment | undefined> {
    this.placeholderLoading = true
    try {
      const response = await paymentApi.createPaymentPlaceholder(userId, payment)
      this.placeholderLoading = false
      return response.data
    } catch (error) {
      this.bankSlipPaymentLoading = false
      return undefined
    }
  }

  @action.bound
  async generateBankSlip(
    paymentId: string,
    email: string,
    items: PaymentItem[],
    payer: PaymentPayer,
  ): Promise<Payment | undefined> {
    this.bankSlipPaymentLoading = true
    try {
      const response = await paymentApi.bankSlipGenerate(
        paymentId,
        'bank_slip',
        email,
        items,
        payer,
      )
      this.bankSlipPaymentLoading = false
      return response.data
    } catch (error) {
      this.bankSlipPaymentLoading = false
      return undefined
    }
  }

  @action.bound
  async generateCCToken(
    ccNumber: string,
    cvv: string,
    firstName: string,
    lastName: string,
    month: string,
    year: string,
  ): Promise<string | undefined> {
    this.creditCardPaymentLoading = true
    try {
      const response = await paymentApi.generateCCToken(
        ccNumber,
        cvv,
        firstName,
        lastName,
        month,
        year,
      )
      this.creditCardPaymentLoading = false
      return response.data?.id
    } catch (error) {
      this.creditCardPaymentLoading = false
      return undefined
    }
  }

  @action.bound
  async generateCC(
    paymentId: string,
    email: string,
    items: PaymentItem[],
    payer: PaymentPayer,
    token: string,
    months: string,
  ): Promise<ResponseStatus> {
    this.creditCardPaymentLoading = true
    try {
      const response = await paymentApi.creditCardGenerateByPlaceholder(
        paymentId,
        token,
        email,
        items,
        payer,
        months,
      )
      this.creditCardPaymentLoading = false
      if (response.data?.success) {
        return ResponseStatus.SUCCESS
      }
      return ResponseStatus.PAYMENT_FAILED
    } catch (error) {
      this.creditCardPaymentLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async loadPlaceholders(clientId: string): Promise<ResponseStatus> {
    this.placeholderLoading = true

    const response = await paymentApi.loadPlaceholders(clientId)
    try {
      if (response.status === 200 && response.data) {
        this.placeholders = response.data
        this.placeholderLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.placeholders = []
        this.placeholderLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.placeholders = []
      this.placeholderLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async loadClientPendingPayments(clientId: string): Promise<ResponseStatus> {
    this.pendingPaymentsLoading = true

    const response = await paymentApi.loadPendingPaymentsByClientId(clientId)
    try {
      if (response.status === 200 && response.data) {
        this.pendingPayments = response.data
        this.pendingPaymentsLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.pendingPayments = []
        this.pendingPaymentsLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.pendingPayments = []
      this.pendingPaymentsLoading = false
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
}

export default PaymentStore
