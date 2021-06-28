import { post, get, put, del } from './client'
import { Response, PaymentItem, PaymentPayer, Payment, IuguCC } from '~/types'
import { PREFIX_URL } from '~/utils/consts'

const endpoint = PREFIX_URL

export const bankSlipGenerate = (
  paymentId: string,
  method = 'bank_slip',
  email: string,
  items: PaymentItem[],
  payer: PaymentPayer,
): Promise<Response<Payment>> => {
  return put(`/payments/bankSlip/operation/update/${paymentId}`, { method, email, items, payer })
}

export const creditCardGenerate = (
  userId: string,
  token: string,
  email: string,
  items: PaymentItem[],
  payer: PaymentPayer,
  months: string,
): Promise<Response<Payment>> => {
  return post(`/payments/creditCard/operation/${userId}`, { token, email, items, payer, months })
}

export const creditCardGenerateByPlaceholder = (
  paymentId: string,
  token: string,
  email: string,
  items: PaymentItem[],
  payer: PaymentPayer,
  months: string,
): Promise<Response<Payment>> => {
  return put(`/payments/creditCard/operation/update/${paymentId}`, {
    token,
    email,
    items,
    payer,
    months,
  })
}

export const generateCCToken = (
  ccNumber: string,
  cvv: string,
  firstName: string,
  lastName: string,
  month: string,
  year: string,
): Promise<Response<IuguCC>> => {
  return post(`/payments/creditCard/operation/cc/token`, {
    ccNumber,
    cvv,
    firstName,
    lastName,
    month,
    year,
  })
}

export const loadPlaceholders = (clientId: string) => {
  return post(`${endpoint}/payments/placeholders`, { client: clientId })
}

export const createPaymentPlaceholder = (
  clientId: string,
  payment: Payment,
): Promise<Response<Payment>> => {
  return post(`/payments/placeholder/createplaceholder?clientId=${clientId}`, payment)
}

export const loadPaymentsByClientId = (clientId: string): Promise<Response<Payment[]>> => {
  return get(`${endpoint}/users/getUserPayments?clientId=${clientId}`)
}

export const loadPendingPaymentsByClientId = (clientId: string): Promise<Response<Payment[]>> => {
  return get(`${endpoint}/users/getUserPendingPayments?clientId=${clientId}`)
}

export const deletePayment = (
  paymentId: string,
  clientId: string,
): Promise<Response<Payment[]>> => {
  return del(`/payments/general/deletepayment/${paymentId}/${clientId}`)
}
