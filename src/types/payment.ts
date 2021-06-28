export interface Payment {
  _id?: any
  type?: string
  months?: number
  item: PaymentItem
  charge_identification?: string
  max_parcels?: number
  message?: string
  doc_erros?: string
  success?: string
  url?: string
  pdf?: string
  identification?: string
  invoice_id?: string
  LR?: string
  status: string
  expiry_date?: Date
  createdAt?: Date
  updatedAt?: Date
}
export interface PaymentItem {
  description: string
  quantity: number
  price_cents: number
}

export interface PaymentPayer {
  cpf_cnpj: string
  name: string
  email: string
  address: { zip_code: string; number: string }
}

export interface IuguCC {
  id: string
  method: string
  test: boolean
  extra_info: {
    brand: string
    holder_name: string
    display_number: string
    bin: string
    month: number
    year: number
  }
}

export enum PaymentStatus {
  PAID = 'paid',
  PENDING = 'pending',
  PLACEHOLDER = 'placeholder',
}
