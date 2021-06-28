/* eslint-disable indent */
import React, { memo, useState, useCallback, useEffect, useRef, createRef } from 'react'
import { useHistory } from 'react-router-dom'
import { Card, List, Layout, message, Button, Select, Popconfirm } from 'antd'
import { Document, ResponseStatus } from '~/types'
import {
  faFilePdf,
  faFileImage,
  faFileWord,
  faFile,
  faTrash,
  faUpload,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { rowDisplayCenter, columnDisplayStart } from '~/utils/display'
import path from 'path'

import ClientLayout from '~/pages/GlobalLayout'
import { useStores } from '~/hooks/use-stores'
import { MSG_UPLOAD_FAILED, MSG_UPLOAD_SUCCESS, MSG_UPLOAD_TYPE_FAILED } from '~/utils/messages'
import { observer } from 'mobx-react-lite'

import CustomModal from '~/assets/components/CustomModal'

import moment from 'moment'
import { checkPendingDocuments } from '~/utils/document-utils'
import { displayMoment } from '~/utils/date-utils'
import { useMediaQuery } from 'react-responsive'

import * as documentApi from '~/services/api/document'

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

const AttachDocuments = observer(() => {
  const { documentStore, authStore, profileStore, clientStore, sharepointStore } = useStores()

  const history = useHistory()

  const [selectedType, setSelectedType] = useState<string | undefined>(undefined)
  const [modalState, setModalState] = useState(false)

  const [listRefs, setListRefs] = useState<React.MutableRefObject<HTMLInputElement | null>[]>([])

  const hiddenFileInput = useRef<HTMLInputElement>(null)

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

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

  const onFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>, documentType?: string) => {
      if (event.target.files) {
        const data = new FormData()
        data.append('document', event.target.files[0])
        if (clientStore.currentUser) {
          const typeToSave = documentType ? documentType : selectedType
          if (typeToSave) {
            data.append('foldername', `PORTAL BCA`)
            const length = 30
            const trimmedName =
              typeToSave.length > length ? typeToSave.substring(0, length - 3) : documentType
            data.append(
              'filename',
              `${clientStore.currentUser.name} - ${trimmedName}${path.extname(
                event.target.files[0].name,
              )}`,
            )
            await sharepointStore.uploadDocument(data)
            const status = await documentStore.uploadDocument(
              clientStore.currentUser._id,
              typeToSave,
              data,
            )

            if (status === ResponseStatus.SUCCESS) {
              documentStore.loadDocuments(clientStore.currentUser._id)
              message.success(MSG_UPLOAD_SUCCESS)
            } else {
              message.error(MSG_UPLOAD_FAILED)
            }
          } else {
            message.error(MSG_UPLOAD_TYPE_FAILED)
          }
        }
      }
    },
    [documentStore, selectedType, clientStore.currentUser, sharepointStore],
  )

  const excludeDocumentHandle = useCallback(
    async (document: Document) => {
      await documentStore.deleteDocument(document._id!, clientStore.currentUser!._id)
      if (clientStore.currentUser) {
        documentStore.loadDocuments(clientStore.currentUser._id)
      }
    },
    [documentStore, clientStore.currentUser],
  )

  const renderUpload = useCallback(
    (buttonText: string) => {
      return (
        <div>
          <Button onClick={() => handleClick()}>{buttonText}</Button>
          <input
            ref={hiddenFileInput}
            type="file"
            onChange={onFileChange}
            style={{ display: 'none' }}
          />
        </div>
      )
    },
    [onFileChange],
  )

  const renderListUpload = useCallback(
    (buttonText: string, refIndex: number, type: string) => {
      return (
        <div>
          <Button
            type="primary"
            onClick={() => handleRefClick(refIndex)}
            loading={documentStore.uploadLoading}
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
    [onFileChange, listRefs, handleRefClick, documentStore.uploadLoading],
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
          <div>
            <Button onClick={() => downloadFile(document)}>BAIXAR</Button>
            <Popconfirm
              title="Deseja realmente excluir o documento?"
              onConfirm={() => excludeDocumentHandle(document)}
              okButtonProps={{ danger: true }}
              okText="Excluir"
              cancelText="Não"
            >
              <FontAwesomeIcon
                size="1x"
                icon={faTrash}
                style={{ marginLeft: '10px', marginRight: '10px', cursor: 'pointer' }}
              />
            </Popconfirm>
          </div>
        </div>
      )
    },
    [excludeDocumentHandle, downloadFile],
  )

  const renderPendingDocuments = useCallback(() => {
    if (clientStore.currentUser) {
      const pending = checkPendingDocuments(
        clientStore.currentUser.profile.neededDocuments,
        documentStore.documents,
      )

      if (pending.length > 0) {
        return (
          <div style={{ marginBottom: '30px' }}>
            <h2>Documentos Pendentes</h2>
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
  }, [clientStore.currentUser, documentStore.documents, renderListUpload])

  useEffect(() => {
    if (clientStore.currentUser) {
      documentStore.loadDocuments(clientStore.currentUser._id)
    }
  }, [clientStore.currentUser, documentStore, profileStore])

  useEffect(() => {
    if (clientStore.currentUser) {
      const pending = checkPendingDocuments(
        clientStore.currentUser.profile.neededDocuments,
        documentStore.documents,
      )

      if (pending.length > 0) {
        const newRefs = pending.map(() => createRef<HTMLInputElement>())
        setListRefs(newRefs)
      }
    }
  }, [clientStore.currentUser, documentStore.documents])

  useEffect(() => {
    if (authStore.loggedUser) {
      clientStore.loadClient(authStore.loggedUser._id)
    }
  }, [authStore.loggedUser, clientStore])

  return (
    <div>
      <ClientLayout
        title="ANEXAR DOCUMENTOS"
        onBack={() => history.push('/client/menu')}
        content={
          <Content>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Card
                className="custom-card"
                style={{
                  width: isPortrait ? '95vw' : '50vw',
                  height: '65vh',
                  overflowY: 'auto',
                  marginBottom: isPortrait ? '2vh' : 0,
                }}
              >
                {renderPendingDocuments()}
                <div>
                  <h2>Documentos Enviados</h2>
                  <List locale={{ emptyText: 'SEM DADOS' }}>
                    {documentStore.documents.map((document) => (
                      <List.Item key={document._id} className="custom-list-item">
                        {renderDocument(document)}
                      </List.Item>
                    ))}
                  </List>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                  <Button type="primary" onClick={() => setModalState(true)}>
                    <FontAwesomeIcon icon={faUpload} />
                  </Button>
                </div>
              </Card>
            </div>
          </Content>
        }
      />
      {modalState && (
        <CustomModal
          title="Envio de Documento"
          visible={true}
          onCancel={() => setModalState(false)}
          destroyOnClose
          okButtonProps={{ style: { display: 'none' } }}
          cancelButtonProps={{ style: { display: 'none' } }}
          content={
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <Select
                style={{ width: '100%', marginBottom: '20px' }}
                placeholder="Tipo do documento"
                onChange={(value) => setSelectedType(value.toString())}
                loading={profileStore.loadingUserProfile}
              >
                {clientStore.currentUser &&
                  clientStore.currentUser.profile.neededDocuments.map((type) => (
                    <Select.Option value={type} key={type}>
                      {type}
                    </Select.Option>
                  ))}
              </Select>
              {renderUpload('Selecione o arquivo')}
            </div>
          }
        />
      )}
    </div>
  )
})

export default memo(AttachDocuments)
