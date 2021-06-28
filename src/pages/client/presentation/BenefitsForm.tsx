import React, { memo, useCallback, useEffect } from 'react'
import { Card, Row, Col } from 'antd'

import PresentationLayout from './PresentationLayout'
import ClientLayout from '~/pages/GlobalLayout'

import { useHistory } from 'react-router-dom'
import { useStores } from '~/hooks/use-stores'
import { observer } from 'mobx-react-lite'

import { ResponseStatus } from '~/types'
import { useMediaQuery } from 'react-responsive'

const BenefitsForm = observer(() => {
  const { profileStore, clientStore } = useStores()

  const history = useHistory()

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  const additionalStyle = isPortrait ? { maxHeight: '100vh' } : { height: '30vh' }

  const onBenefitSelect = useCallback(
    async (profileId: string) => {
      try {
        const response = await clientStore.updateProfile(profileId)
        if (response === ResponseStatus.SUCCESS) {
          history.push('/client/form')
        }
      } catch (error) {
        console.error(error)
      }
      // history.push('/client/form')
    },
    [clientStore, history],
  )

  useEffect(() => {
    profileStore.loadAll()
  }, [profileStore])

  return (
    <ClientLayout
      content={
        <PresentationLayout>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <p className="title" style={{ textAlign: 'center' }}>
              BENEFÍCIOS PREVIDENCIÁRIOS
            </p>
          </div>
          <Row
            style={{
              marginTop: '-50px',
              marginRight: '4vw',
              marginLeft: '4vw',
            }}
          >
            {profileStore.profiles.map((p) => {
              return (
                <Col span={isPortrait ? 24 : 6} key={p._id}>
                  <Card
                    className="custom-grid-card"
                    style={{
                      ...additionalStyle,
                      margin: '10px',
                      overflowY: 'auto',
                      cursor: 'pointer',
                    }}
                    onClick={() => onBenefitSelect(p._id)}
                  >
                    <span className="subtitle">{p.title}</span>
                    <p>{p.text}</p>
                  </Card>
                </Col>
              )
            })}
          </Row>
        </PresentationLayout>
      }
    />
  )
})

export default memo(BenefitsForm)
