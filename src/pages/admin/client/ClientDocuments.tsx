/* eslint-disable indent */
import React, { createRef, memo, useCallback, useEffect, useRef, useState } from 'react'
import { Card, List, Popconfirm, message, Button, Spin } from 'antd'
import { Document, ResponseStatus } from '~/types'
import {
  faFilePdf,
  faFileImage,
  faFileWord,
  faFile,
  faTrash,
  faUpload,
  faFileSignature,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { rowDisplayCenter, columnDisplayStart } from '~/utils/display'
import { PDFInfo } from '~/types'
import path from 'path'

import { useStores } from '~/hooks/use-stores'
import { observer } from 'mobx-react-lite'
import { MSG_UPLOAD_FAILED } from '~/utils/messages'
import { checkPendingDocuments } from '~/utils/document-utils'
import { useMediaQuery } from 'react-responsive'

import * as documentApi from '~/services/api/document'

interface Props {
  divCardStyle: React.CSSProperties
  cardStyle: React.CSSProperties
}

function getIconFromType(documentType: string) {
  switch (documentType) {
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

const ClientDocuments = observer(({ divCardStyle, cardStyle }: Props) => {
  const { adminStore, documentStore, sharepointStore } = useStores()
  const [loadingAccept, setLoadingAccept] = useState(false)
  const [loadingAcceptContract, setLoadingAcceptContract] = useState(false)

  const [listRefs, setListRefs] = useState<React.MutableRefObject<HTMLInputElement | null>[]>([])

  const hiddenFileInput = useRef<HTMLInputElement>(null)

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  const handleClick = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click()
    }
  }

  const handleRefClick = useCallback(
    (index: number) => {
      if (listRefs[index] && listRefs[index].current) {
        listRefs[index].current!.click()
      }
    },
    [listRefs],
  )

  const contractHandle = useCallback(async () => {
    let info: PDFInfo

    setLoadingAcceptContract(true)
    if (adminStore.selectedClient) {
      info = {
        name: adminStore.selectedClient?.name,
        marital_status: adminStore.selectedClient?.marital_status,
        cpf: adminStore.selectedClient?.cpf,
        rg: adminStore.selectedClient?.rg,
        address: adminStore.selectedClient.address!,
        zipcode: adminStore.selectedClient.zipcode!,
      }

      try {
        await documentStore.generateContractPDFDocument(info, adminStore.selectedClient?._id)
        await documentApi.sendFileToSign(`Contrato-${adminStore.selectedClient?.name}.pdf`, [
          adminStore.selectedClient?.email,
        ])
        await documentStore.generateProcuracaoPDFDocument(info, adminStore.selectedClient?._id)
        await documentApi.sendFileToSign(`Procuracao-${adminStore.selectedClient?.name}.pdf`, [
          adminStore.selectedClient?.email,
        ])
        setLoadingAcceptContract(false)
        message.success('Documento adicionado para assinatura na área "Assinar Documentos"')
      } catch (err) {
        message.error(err)
      }
    }
  }, [adminStore.selectedClient, documentStore])

  const aceiteHandle = useCallback(async () => {
    setLoadingAccept(true)

    let info: PDFInfo

    if (adminStore.selectedClient) {
      info = {
        name: adminStore.selectedClient?.name,
        marital_status: adminStore.selectedClient?.marital_status,
        cpf: adminStore.selectedClient?.cpf,
        rg: adminStore.selectedClient?.rg,
        address: adminStore.selectedClient.address!,
        zipcode: adminStore.selectedClient.zipcode!,
      }

      try {
        await documentStore.generateAceitePDFDocument(info, adminStore.selectedClient?._id)
        await documentApi.sendFileToSign(`Aceite-${adminStore.selectedClient?.name}.pdf`, [
          adminStore.selectedClient?.email,
        ])
        message.success('Documento adicionado para assinatura na área "Assinar Documentos"')
        setLoadingAccept(false)
      } catch (err) {
        message.error(err)
      }
    }
  }, [adminStore.selectedClient, documentStore])

  const downloadFile = useCallback(
    async (d4document: Document) => {
      if (d4document.d4sign_id && d4document.sign_status === 'finished') {
        const link_info = await documentApi.downloadSignedFile(d4document.d4sign_id)

        const link = document.createElement('a')
        link.href = link_info.data.url
        link.setAttribute(
          'download',
          `Assinatura-${d4document.d4sign_id.slice(0, 5)}-${
            adminStore.selectedClient!.name.split(' ')[0]
          }`,
        )
        document.body.appendChild(link)
        link.click()
      } else {
        const splitted = d4document.path.split('.')
        const originalName = `${d4document.type.replace(/ /g, '_')}--${
          adminStore.selectedClient!.name.split(' ')[0]
        }.${splitted[1]}`
        documentApi.downloadFile(splitted[0], splitted[1], originalName)
      }
    },
    [adminStore.selectedClient],
  )

  const refreshDocuments = useCallback(async () => {
    if (adminStore.selectedClient) {
      await documentStore.loadDocuments(adminStore.selectedClient._id)
      await documentStore.loadSignedDocuments(adminStore.selectedClient._id)
    }
  }, [adminStore.selectedClient, documentStore])

  const onFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>, documentType?: string) => {
      if (event.target.files) {
        const data = new FormData()
        data.append('document', event.target.files[0])
        if (adminStore.selectedClient) {
          data.append('foldername', `PORTAL BCA`)
          let status = ResponseStatus.INTERNAL_ERROR

          if (!documentType) {
            data.append(
              'filename',
              `${adminStore.selectedClient.name}-${event.target.files[0].name}`,
            )
            status = await documentStore.uploadDocumentToSign(
              adminStore.selectedClient._id,
              event.target.files[0].name,
              data,
              [adminStore.selectedClient.email],
            )
            await sharepointStore.uploadDocument(data)
          } else {
            const length = 30
            const trimmedName =
              documentType.length > length ? documentType.substring(0, length - 3) : documentType
            data.append(
              'filename',
              `${adminStore.selectedClient.name} - ${trimmedName}${path.extname(
                event.target.files[0].name,
              )}`,
            )
            status = await documentStore.uploadDocument(
              adminStore.selectedClient._id,
              documentType,
              data,
            )
            await sharepointStore.uploadDocument(data)
          }

          switch (status) {
            case ResponseStatus.SUCCESS: {
              refreshDocuments()
              message.success('Documento enviado com sucesso.')
              break
            }
            case ResponseStatus.SIGN_FAILED: {
              message.error('Falha ao enviar o documento para assinatura.')
              break
            }
            default: {
              message.error(MSG_UPLOAD_FAILED)
              break
            }
          }
        }
      }
    },
    [documentStore, adminStore, refreshDocuments, sharepointStore],
  )

  const renderListUpload = useCallback(
    (buttonText: string, refIndex: number, type: string) => {
      return (
        <div>
          <Button
            type="primary"
            onClick={() => handleRefClick(refIndex)}
            // loading={documentStore.uploadLoading}
          >
            {buttonText}
          </Button>
          <input
            ref={listRefs[refIndex]}
            type="file"
            onChange={(event) => onFileChange(event, type)}
            style={{ display: 'none' }}
          />
        </div>
      )
    },
    [onFileChange, listRefs, handleRefClick],
  )

  const renderPendingDocuments = useCallback(() => {
    if (adminStore.selectedClient) {
      const pending = checkPendingDocuments(
        adminStore.selectedClient.profile.neededDocuments,
        documentStore.documents,
      )

      if (pending.length > 0) {
        return (
          <div style={{ marginBottom: '30px' }}>
            <List>
              {pending.map((needed, index) => (
                <List.Item key={needed} className="custom-list-item">
                  {
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        marginLeft: '10px',
                        marginRight: '10px',
                      }}
                    >
                      <span style={{ fontWeight: 'bold' }}>{needed}</span>

                      {renderListUpload('Enviar', index, needed)}
                    </div>
                  }
                </List.Item>
              ))}
            </List>
          </div>
        )
      }
    }

    return <></>
  }, [adminStore.selectedClient, documentStore.documents, renderListUpload])

  const renderUpload = useCallback(() => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Button
          onClick={() => handleClick()}
          type="primary"
          loading={documentStore.uploadLoading}
          style={{ margin: '10px' }}
        >
          FAZER UPLOAD <FontAwesomeIcon icon={faUpload} style={{ marginLeft: '10px' }} />
        </Button>
        <input
          ref={hiddenFileInput}
          type="file"
          onChange={onFileChange}
          style={{ display: 'none' }}
        />
        <div>
          <Button
            onClick={() => aceiteHandle()}
            type="primary"
            loading={loadingAccept}
            style={{ margin: '10px' }}
          >
            GERAR CONTRATO DE ACEITE{' '}
            <FontAwesomeIcon icon={faFileSignature} style={{ marginLeft: '10px' }} />
          </Button>
        </div>
        <div>
          <Button
            onClick={() => contractHandle()}
            type="primary"
            loading={loadingAcceptContract}
            style={{ margin: '10px' }}
          >
            GERAR PROCURAÇÃO/CONTRATO{' '}
            <FontAwesomeIcon icon={faFileSignature} style={{ marginLeft: '10px' }} />
          </Button>
        </div>
      </div>
    )
  }, [
    onFileChange,
    documentStore.uploadLoading,
    aceiteHandle,
    loadingAccept,
    contractHandle,
    loadingAcceptContract,
  ])

  const excludeDocumentHandle = useCallback(
    async (document: Document) => {
      await documentStore.deleteDocument(document._id!, adminStore.selectedClient!._id)
      refreshDocuments()
    },
    [documentStore, refreshDocuments, adminStore.selectedClient],
  )

  useEffect(() => {
    refreshDocuments()
  }, [refreshDocuments])

  useEffect(() => {
    if (adminStore.selectedClient) {
      const pending = checkPendingDocuments(
        adminStore.selectedClient.profile.neededDocuments,
        documentStore.documents,
      )

      if (pending.length > 0) {
        const newRefs = pending.map(() => createRef<HTMLInputElement>())
        setListRefs(newRefs)
      }
    }
  }, [adminStore.selectedClient, documentStore.documents])

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
            width: '100%',
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
            </div>
          </div>
          <div>
            <Button onClick={() => downloadFile(document)}>BAIXAR</Button>
            <Popconfirm
              title="Deseja realmente remover este documento?"
              onConfirm={() => excludeDocumentHandle(document)}
              okButtonProps={{ danger: true }}
              okText="Excluir"
              cancelText="Não"
            >
              <FontAwesomeIcon
                icon={faTrash}
                style={{ cursor: 'pointer', marginLeft: '10px', marginRight: '10px' }}
              />
            </Popconfirm>
          </div>
        </div>
      )
    },
    [excludeDocumentHandle, downloadFile],
  )

  return (
    <div style={divCardStyle}>
      <Card
        className="custom-card"
        title={
          <span style={{ color: '#04093b', fontFamily: 'Bebas Neue', fontSize: '20px' }}>
            DOCUMENTOS RECEBIDOS
          </span>
        }
        style={cardStyle}
      >
        <Spin spinning={documentStore.uploadLoading}>
          {
            <List locale={{ emptyText: 'SEM DADOS' }}>
              {documentStore.documents &&
                documentStore.documents.map((document) => (
                  <List.Item key={document._id} className="custom-list-item">
                    {renderDocument(document)}
                  </List.Item>
                ))}
            </List>
          }
        </Spin>
        {renderPendingDocuments()}
      </Card>

      <Card
        className="custom-card"
        title={
          <span style={{ color: '#04093b', fontFamily: 'Bebas Neue', fontSize: '20px' }}>
            DOCUMENTOS ASSINADOS
          </span>
        }
        style={{
          ...cardStyle,
          marginLeft: isPortrait ? 0 : '5px',
          marginTop: isPortrait ? '5px' : 0,
          marginBottom: isPortrait ? '10px' : 0,
        }}
      >
        <List locale={{ emptyText: 'SEM DADOS' }}>
          {documentStore.signedDocuments &&
            documentStore.signedDocuments.map((document) => (
              <List.Item key={document._id} className="custom-list-item">
                {renderDocument(document)}
              </List.Item>
            ))}
          <List.Item key="upload">{renderUpload()}</List.Item>
        </List>
      </Card>
    </div>
  )
})

export default memo(ClientDocuments)
