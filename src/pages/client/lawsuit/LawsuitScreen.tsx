/* eslint-disable indent */
import React, { memo, useState, useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Card, List, Layout } from 'antd'
import { Lawsuit } from '~/types'
import { observer } from 'mobx-react-lite'

import { useStores } from '~/hooks/use-stores'

import ClientLayout from '~/assets/components/GlobalLayout'
import { useMediaQuery } from 'react-responsive'
import { titleStyle } from '../../styles'

const { Content } = Layout

const LawsuitScreen = observer(() => {
  const history = useHistory()

  const { lawsuitStore, clientStore, authStore } = useStores()

  const [lawsuits, setLawsuits] = useState<Lawsuit[]>([])

  const [selectedLawsuit, setSelectedLaysuit] = useState<Lawsuit | undefined>(undefined)

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  const selectLawsuitHandle = useCallback((lawsuit: Lawsuit) => {
    setSelectedLaysuit(lawsuit)
  }, [])

  const getClientLawsuits = useCallback(
    async (id: string) => {
      try {
        await lawsuitStore.loadClientLawsuits(id)
        setLawsuits(lawsuitStore.lawsuits)
      } catch (error) {
        lawsuitStore.selectedLawsuit = undefined
        console.error(error)
      }
    },
    [lawsuitStore, setLawsuits],
  )

  const renderLawsuit = useCallback((lawsuit: Lawsuit) => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          marginRight: '10px',
          marginLeft: '10px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          }}
        >
          <div>
            <span style={{ fontWeight: 'bold' }}>{`Nº ${lawsuit.proc_number}`}</span>
            <br></br>
            <span>NOTICE DATE: {lawsuit.notice_date}</span>
            <br></br>
            <span>ADVOGADO: {lawsuit.lawyer!.name}</span>
            <br></br>
          </div>
        </div>
      </div>
    )
  }, [])

  const renderInternalNote = useCallback((internalNote: any) => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          marginRight: '10px',
          marginLeft: '10px',
        }}
      >
        <div>
          <span>{internalNote.info}</span>
          <div>
            <span
              style={{ fontWeight: 'bold', fontSize: '10px' }}
            >{`${internalNote.date?.toString()} - por ${internalNote.lawyer}`}</span>
          </div>
        </div>
      </div>
    )
  }, [])

  useEffect(() => {
    if (clientStore.currentUser) {
      getClientLawsuits(clientStore.currentUser._id)
    }
  }, [getClientLawsuits, clientStore.currentUser])

  useEffect(() => {
    if (authStore.loggedUser) {
      clientStore.loadClient(authStore.loggedUser._id)
    }
  }, [authStore.loggedUser, clientStore])

  return (
    <ClientLayout
      title="Andamento processual"
      onBack={() => history.push('/client/menu')}
      content={
        <Content>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: isPortrait ? 'column' : 'row',
              marginTop: '15px',
            }}
          >
            <Card
              className="custom-card"
              title={<span style={titleStyle('25px')}>Andamento processual</span>}
              style={{
                width: isPortrait ? '90vw' : '40vw',
                height: '65vh',
                overflowY: 'auto',
                marginBottom: '10px',
                marginRight: isPortrait ? 0 : '10px',
              }}
            >
              <List locale={{ emptyText: 'SEM DADOS' }}>
                {lawsuits.map((lawsuit) => (
                  <List.Item
                    key={lawsuit._id}
                    className="custom-list-item-selectable"
                    onClick={() => selectLawsuitHandle(lawsuit)}
                  >
                    {renderLawsuit(lawsuit)}
                  </List.Item>
                ))}
              </List>
            </Card>
            <Card
              className="custom-card"
              title={
                <span style={titleStyle('25px')}>
                  {selectedLawsuit?.proc_number
                    ? `Andamento Interno - ${selectedLawsuit?.proc_number}`
                    : `Andamento Interno`}
                </span>
              }
              style={{
                width: isPortrait ? '90vw' : '40vw',
                height: '65vh',
                overflowY: 'auto',
                marginBottom: '10px',
              }}
            >
              <List locale={{ emptyText: 'SEM DADOS' }}>
                {selectedLawsuit &&
                  selectedLawsuit.internal_notes?.map(
                    (note) =>
                      !note.isPrivate && (
                        <List.Item key={note} className="custom-list-item">
                          {renderInternalNote(note)}
                        </List.Item>
                      ),
                  )}
              </List>
            </Card>
          </div>
        </Content>
      }
    />
  )
})

export default memo(LawsuitScreen)
