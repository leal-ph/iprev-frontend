export interface Document {
  _id?: string
  type: string
  path: string
  need_sign?: boolean
  d4sign_id?: string
  sign_status?: string
  finished_ts?: number
  signers_info?: SignerInfo[]
  createdAt?: Date
}

export interface SignerInfo {
  email: string
  key_signer: string
  signed: boolean
  doc_uuid: string
}

export interface PendingDocs {
  pending_docs: number
  pending_list: Array<string>
}

export interface PDFInfo {
  name: string
  marital_status?: string
  cpf: string
  rg: string
  address: string
  zipcode: string
}
