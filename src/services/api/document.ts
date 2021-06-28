import { post, get, put, del } from './client'
import { ResponseUpload, Response, Document, PDFInfo } from '~/types'
import { PREFIX_URL } from '~/utils/consts'

const endpoint = PREFIX_URL

export const downloadFile = (filename: string, filetype: string, originalName: string): void => {
  get(`/documents/files/download?filename=${filename}&filetype=${filetype}`, {
    responseType: 'blob',
  }).then((response) => {
    let mime: any

    if (filetype === 'pdf') {
      mime = {
        type: 'application/pdf',
      }
    } else {
      mime = {
        type: 'application/octet-stream',
      }
    }
    const url = window.URL.createObjectURL(new Blob([response.data], mime))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${originalName}`)
    document.body.appendChild(link)
    link.click()
  })
}

export const uploadFile = (
  userId: string,
  documentType: string,
  data: FormData,
): Promise<Response<ResponseUpload>> => {
  return post(`/documents/files/upload/${userId}/${documentType}?needSign=${false}`, data, {
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

export const downloadSignedFile = (documentId: string): Promise<any> => {
  return post(
    `/documents/d4sign/download`,
    { doc_uuid: documentId },
    {
      headers: {
        'Content-Type': `application/json`,
      },
    },
  )
}

export const sendFileToSign = (documentPath: string, signers: string[]): Promise<Response<any>> => {
  return post(`/documents/d4sign/sendtosign`, { file: documentPath, signers })
}

export const loadDocs = (): Promise<Response<Document[]>> => {
  return get(`${endpoint}/docs/getAllDocs`)
}

export const loadClientDocs = (clientId: string): Promise<Response<Document[]>> => {
  return get(`${endpoint}/users/getUserDocuments?clientId=${clientId}`)
}

export const loadAllSignedDocs = (): Promise<Response<Document[]>> => {
  return get(`${endpoint}/docs/getSignedDocs`)
}

export const loadClientSignedDocs = (clientId: string): Promise<Response<Document[]>> => {
  return get(`${endpoint}/users/getUserSignedDocuments?clientId=${clientId}`)
}

export const generateAceitePDF = (info: PDFInfo, clientId: string): Promise<Response<any>> => {
  return post(`/documents/pdf/generateAceitePDF/${clientId}`, info)
}

export const generateProcuracaoPDF = (info: PDFInfo, clientId: string): Promise<Response<any>> => {
  return post(`/documents/pdf/generateProcuracaoPDF/${clientId}`, info)
}

export const generateContractPDF = (info: PDFInfo, clientId: string): Promise<Response<any>> => {
  return post(`/documents/pdf/generateContractPDF/${clientId}`, info)
}

export const editDoc = (doc: any, doc_id: string): Promise<Response<Document[]>> => {
  return put(`${endpoint}/docs/updatedoc/${doc_id}`, doc)
}

export const deleteDoc = (doc_id: string, clientId: string): Promise<Response<Document>> => {
  return del(`${endpoint}/docs/deletedoc/${doc_id}/${clientId}`)
}
