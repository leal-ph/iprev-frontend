import { Payment, PaymentStatus } from '~/types'

export const checkPayed = (payments: Payment[]): boolean => {
  if (payments.find((payment) => payment.status === PaymentStatus.PAID)) {
    return true
  }

  return false
}

export const formatCurrency = (priceCents: number): string => {
  return priceCents.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
  })
}
