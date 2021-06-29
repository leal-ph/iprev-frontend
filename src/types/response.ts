export type Response<T> = {
  data?: T
  status: number
  message: string
}

export interface ResponseUpload {
  fileId: string
}

export enum ResponseStatus {
  INTERNAL_ERROR,
  SUCCESS,
  CLIENT_UNDEFINED,
  PAYMENT_FAILED,
  UPLOAD_FAILED,
  LOGIN_FAILED,
  USER_NOT_LOADED,
  SIGN_FAILED,
  UNAUTHORIZED,
  DUPLICATE_REGISTER_CPF,
  DUPLICATE_REGISTER_RG,
  DUPLICATE_REGISTER,
  DUPLICATE_REGISTER_EXISTS_AS_LAWYER,
  FINISHED_REGISTER,
  INCOMPLETE_REGISTER,
  USER_NOT_FOUND,
  WRONG_PASSWORD,
  INVALID_CODE,
  NO_RENEW_PERMISSION,
  EXPIRED_CODE,
}