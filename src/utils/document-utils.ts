import { Document } from '~/types'

export const checkPendingDocuments = (
  neededDocuments: string[],
  documents: Document[],
): string[] => {
  // eslint-disable-next-line
  const filtered = neededDocuments.filter((document) => {
    const match = documents.filter((send) => send.type === document)
    if (match.length === 0 || document === 'OUTROS DOCUMENTOS') {
      return document
    }
  })
  return filtered
}
