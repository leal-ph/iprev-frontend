/* eslint-disable indent */
import React, { useEffect, useState, useCallback, memo } from 'react'
import { observer } from 'mobx-react-lite'
import { useStores } from '~/hooks/use-stores'
import { Document } from '~/types'
import { Layout, Card, List, Button, message, Divider } from 'antd'

import ClientLayout from '~/pages/GlobalLayout'
import { columnDisplayStart, rowDisplayCenter } from '~/utils/display'
import {
  faFilePdf,
  faFileImage,
  faFileWord,
  faFile,
  faFileSignature,
  faFileDownload,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'antd/node_modules/moment'
import { displayMoment } from '~/utils/date-utils'
import { MSG_DOCUMENT_SIGNER_NOT_FOUND, MSG_DOCUMENT_SIGN_SUCCESS } from '~/utils/messages'
import { useHistory } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'

import * as documentApi from '~/services/api/document'

declare global {
  interface Window {
    d4sign: any
    is_chrome: boolean
  }
}

const { Content } = Layout

function getIconFromType(extension: string) {
  switch (extension) {
    case 'pdf':
      return faFilePdf
    case 'png':
    case 'jpg':
    case 'jpeg':
      return faFileImage
    case 'doc':
    case 'docx':
      return faFileWord
    default:
      return faFile
  }
}

const SignScreen = observer(() => {
  const { authStore, documentStore, clientStore } = useStores()

  const history = useHistory()

  const [documentsToSign, setDocumentsToSign] = useState<Document[]>([])
  const [signedDocuments, setSignedDocuments] = useState<Document[]>([])
  const [showSign, setShowSign] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | undefined>(undefined)

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  const onSign = useCallback((document: Document) => {
    setSelectedDocument(document)
    setShowSign(true)
  }, [])

  const downloadFile = useCallback(
    async (d4document: Document) => {
      if (d4document.d4sign_id && d4document.sign_status === 'finished') {
        const link_info = await documentApi.downloadSignedFile(d4document.d4sign_id)

        const link = document.createElement('a')
        link.href = link_info.data.url
        link.setAttribute(
          'download',
          `Assinatura-${d4document.d4sign_id.slice(0, 5)}-${
            clientStore.currentUser!.name.split(' ')[0]
          }`,
        )
        document.body.appendChild(link)
        link.click()
      } else {
        const splitted = d4document.path.split('.')
        const originalName = `${d4document.type.replace(/ /g, '_')}--${
          clientStore.currentUser!.name.split(' ')[0]
        }.${splitted[1]}`
        documentApi.downloadFile(splitted[0], splitted[1], originalName)
      }
    },
    [clientStore.currentUser],
  )

  const renderDocument = useCallback(
    (document: Document) => {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            flexFlow: 'row no-wrap',
            justifyContent: 'space-between',
            width: '100vw',
          }}
        >
          <div style={rowDisplayCenter}>
            <FontAwesomeIcon
              size="2x"
              icon={getIconFromType(document.path.split('.')[1])}
              style={{ marginLeft: '10px', marginRight: '10px' }}
            />
            <div style={columnDisplayStart}>
              <span style={{ fontWeight: 'bold' }}>{document.type}</span>
              <span style={{ fontWeight: 'bold', fontSize: '10px' }}>
                Enviado em: {displayMoment(moment(document.createdAt))}
              </span>
            </div>
          </div>
          <div style={{ marginRight: '10px' }}>
            <Button onClick={() => downloadFile(document)}>
              {' '}
              {isPortrait ? <FontAwesomeIcon icon={faFileDownload}></FontAwesomeIcon> : 'DOWNLOAD'}
            </Button>
            {document.sign_status !== 'finished' && (
              <Button
                style={{ marginLeft: '10px' }}
                type="primary"
                onClick={() => onSign(document)}
              >
                {isPortrait ? (
                  <FontAwesomeIcon icon={faFileSignature}></FontAwesomeIcon>
                ) : (
                  'ASSINAR'
                )}
              </Button>
            )}
          </div>
        </div>
      )
    },
    [onSign, downloadFile, isPortrait],
  )

  useEffect(() => {
    if (clientStore.currentUser) {
      documentStore.loadDocuments(clientStore.currentUser._id)
    }
  }, [clientStore.currentUser, documentStore])

  useEffect(() => {
    const toSign = documentStore.documents.filter(
      (document) => document.need_sign === true && document.sign_status !== 'finished',
    )
    setDocumentsToSign(toSign)

    const signed = documentStore.documents.filter(
      (document) => document.sign_status && document.sign_status.includes('finished'),
    )
    setSignedDocuments(signed)
  }, [documentStore.documents])

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://s3-sa-east-1.amazonaws.com/embed-d4sign/d4sign.js'
    script.type = 'text/javascript'
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (selectedDocument && selectedDocument.signers_info && authStore.loggedUser && showSign) {
      const signerIndex = selectedDocument.signers_info.findIndex(
        (signer) => signer.email === authStore.loggedUser?.email,
      )

      if (signerIndex === -1) {
        message.error(MSG_DOCUMENT_SIGNER_NOT_FOUND)
        return
      }

      const signerMail = selectedDocument.signers_info[signerIndex].email
      const signerKey = selectedDocument.signers_info[signerIndex].key_signer
      const docUuid = selectedDocument.signers_info[signerIndex].doc_uuid

      window.d4sign.configure({
        container: 'signature-div',
        key: docUuid,
        protocol: 'https',
        host: 'secure.d4sign.com.br/embed/viewblob',
        signer: {
          email: signerMail,
          disable_preview: '0', // optional
          key_signer: signerKey,
        },
        width: '700',
        height: '400',
        callback: function (event: any) {
          if (event.data === 'signed') {
            message.success(MSG_DOCUMENT_SIGN_SUCCESS)
          }
        },
      })
    }
  }, [selectedDocument, authStore.loggedUser, showSign])

  useEffect(() => {
    if (authStore.loggedUser) {
      clientStore.loadClient(authStore.loggedUser._id)
    }
  }, [authStore.loggedUser, clientStore])

  return (
    <div>
      <ClientLayout
        title="ASSINATURA DE DOCUMENTOS"
        onBack={() => history.push('/client/menu')}
        content={
          <Content>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <Card
                className="custom-card"
                style={{
                  width: isPortrait ? '95vw' : '50vw',
                  height: '65vh',
                  overflowY: 'auto',
                  marginBottom: isPortrait ? '2vh' : 0,
                }}
              >
                <div style={{ marginBottom: '20px' }}>
                  <h2>Documentos para Assinar</h2>
                  <List locale={{ emptyText: 'SEM DOCUMENTOS PARA ASSINAR' }}>
                    {documentsToSign.length > 0 &&
                      documentsToSign.map((document) => (
                        <List.Item key={document._id} className="custom-list-item">
                          {renderDocument(document)}
                        </List.Item>
                      ))}
                  </List>
                </div>
                <Divider />
                <div>
                  <h2>Documentos Assinados</h2>
                  <List locale={{ emptyText: 'SEM DOCUMENTOS ASSINADOS' }}>
                    {signedDocuments.length > 0 &&
                      signedDocuments.map((document) => (
                        <List.Item key={document._id} className="custom-list-item">
                          {renderDocument(document)}
                        </List.Item>
                      ))}
                  </List>
                </div>
              </Card>
              {showSign && (
                <Card
                  className="custom-card"
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>ASSINATURA D4SIGN</span>
                      <Button
                        onClick={() => {
                          setShowSign(false)
                          setSelectedDocument(undefined)
                        }}
                      >
                        FECHAR
                      </Button>
                    </div>
                  }
                  style={{
                    width: isPortrait ? '95vw' : '50vw',
                    marginTop: '10px',
                    marginBottom: '2vh',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <div id="signature-div" style={{ overflowX: 'auto' }}></div>
                </Card>
              )}
            </div>
          </Content>
        }
      />
    </div>
  )
})

export default memo(SignScreen)
