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
  // const { profileStore, clientStore } = useStores()

  const history = useHistory()

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  const additionalStyle = isPortrait ? { maxHeight: '100vh' } : { height: '30vh' }

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
          ></Row>
        </PresentationLayout>
      }
    />
  )
})

export default memo(BenefitsForm)
