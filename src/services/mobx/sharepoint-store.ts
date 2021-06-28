import { action, observable } from 'mobx'
import { ResponseStatus, ResponseUpload, Document } from '~/types'

import * as sharepointApi from '~/services/api/sharepoint'

class DocumentStore {
  @observable documentsUploaded: ResponseUpload[] = []
  @observable uploadLoading = false

  @observable documents: Document[] = []
  @observable documentsLoading = false

  @observable signedDocuments: Document[] | undefined
  @observable signedDocumentsLoading = false

  @observable deletedDocument: Document | undefined
  @observable deletedDocumentLoading = false

  @action.bound
  async uploadDocument(data: FormData): Promise<ResponseStatus> {
    this.uploadLoading = true
    try {
      const response = await sharepointApi.uploadFile(data)
      if (response.status === 200 && response.data) {
        this.documentsUploaded.push(response.data)
        this.uploadLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.uploadLoading = false
        return ResponseStatus.UPLOAD_FAILED
      }
    } catch (error) {
      console.error(error)
      this.uploadLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  /* @action.bound
  async deleteDocument(doc_id: string, clientId: string): Promise<ResponseStatus> {
    this.deletedDocumentLoading = true

    const response = await documentApi.deleteDoc(doc_id, clientId)
    try {
      if (response.status === 200 && response.data) {
        this.deletedDocument = response.data
        this.deletedDocumentLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.deletedDocument = undefined
        this.deletedDocumentLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      this.deletedDocument = undefined
      this.deletedDocumentLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  } */
}

export default DocumentStore
