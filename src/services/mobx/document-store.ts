import { action, observable } from 'mobx'
import { ResponseStatus, ResponseUpload, Document, PDFInfo } from '~/types'

import * as documentApi from '~/services/api/document'

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
  async uploadDocument(
    userId: string,
    documentType: string,
    data: FormData,
  ): Promise<ResponseStatus> {
    this.uploadLoading = true
    try {
      const response = await documentApi.uploadFile(userId, documentType, data)
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

  @action.bound
  async uploadDocumentToSign(
    userId: string,
    documentType: string,
    data: FormData,
    signers: string[],
  ): Promise<ResponseStatus> {
    this.uploadLoading = true
    try {
      const response = await documentApi.uploadFileToSign(userId, documentType, data)
      if (response.status === 200 && response.data) {
        const signResponse = await documentApi.sendFileToSign(response.data.fileId, signers)
        if (signResponse.status === 200) {
          this.uploadLoading = false
          return ResponseStatus.SUCCESS
        }
        this.uploadLoading = false
        return ResponseStatus.SIGN_FAILED
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

  @action.bound
  async loadDocuments(userId: string): Promise<ResponseStatus> {
    this.documentsLoading = false
    try {
      const response = await documentApi.loadClientDocs(userId)
      if ((response.status === 200 || response.status === 304) && response.data) {
        this.documents = response.data
        this.documentsLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.documentsLoading = false
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch (error) {
      console.error(error)
      this.documentsLoading = false
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async loadSignedDocuments(userId: string): Promise<ResponseStatus> {
    this.documentsLoading = false
    try {
      const response = await documentApi.loadClientSignedDocs(userId)
      if ((response.status === 200 || response.status === 304) && response.data) {
        this.signedDocuments = response.data
        this.signedDocumentsLoading = false
        return ResponseStatus.SUCCESS
      } else {
        this.signedDocuments = []
        this.signedDocumentsLoading = false
        return ResponseStatus.UPLOAD_FAILED
      }
    } catch (error) {
      console.error(error)
      this.signedDocuments = []
      this.signedDocumentsLoading = false
      return ResponseStatus.UPLOAD_FAILED
    }
  }

  @action.bound
  async editDocument(doc: any, doc_id: string): Promise<ResponseStatus> {
    const response = await documentApi.editDoc(doc, doc_id)
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
  async generateAceitePDFDocument(info: PDFInfo, user_id: string): Promise<any> {
    const response = await documentApi.generateAceitePDF(info, user_id)
    try {
      if (response.status === 200 && response.data) {
        return response.data
      } else {
        return ResponseStatus.INTERNAL_ERROR
      }
    } catch {
      return ResponseStatus.INTERNAL_ERROR
    }
  }

  @action.bound
  async generateProcuracaoPDFDocument(info: PDFInfo, user_id: string): Promise<ResponseStatus> {
    const response = await documentApi.generateProcuracaoPDF(info, user_id)
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
  async generateContractPDFDocument(info: PDFInfo, user_id: string): Promise<ResponseStatus> {
    const response = await documentApi.generateContractPDF(info, user_id)
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
  }
}

export default DocumentStore
