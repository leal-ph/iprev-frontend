import { post } from './client'
import { ResponseUpload, Response } from '~/types'

export const uploadFile = (data: FormData): Promise<Response<ResponseUpload>> => {
  return post(`/sharepoint/uploadfile`, data, {
    headers: {
      'Content-Type': `multipart/form-data`,
    },
  })
}

export const uploadFileToSign = (
  userId: string,
  documentType: string,
  data: FormData,
): Promise<Response<ResponseUpload>> => {
  return post(`/documents/files/upload/${userId}/${documentType}?needSign=${true}`, data, {
    headers: {
      'Content-Type': `multipart/form-data`,
    },
  })
}
