import React, { memo, useCallback, useEffect, useState } from 'react'
import { BOCAYUVA_BLUE_COLOR, MATERIAL_ICON_COLOR } from '~/consts/consts'
import { Layout, Tooltip } from 'antd'
import Logo from '~/assets/img/logo-iprev.svg'

import { observer } from 'mobx-react-lite'
import { useStores } from '~/hooks/use-stores'
import { useHistory } from 'react-router-dom'
import { ResponseStatus, LayoutType } from '~/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faUser, faComment } from '@fortawesome/free-solid-svg-icons'

const { Header } = Layout

interface Props {
  loginPrefix: LayoutType
}

const GlobalHeader = observer(({ loginPrefix }: Props) => {
  const { authStore, clientStore, lawyerStore } = useStores()

  const history = useHistory()

  const [name, setName] = useState<string | undefined>(undefined)

  const loginHandler = useCallback(() => {
    if (!authStore.loggedUser) {
      history.push(`/${loginPrefix}/login`)
    } else {
      history.push(`/${loginPrefix}/profile`)
    }
  }, [authStore.loggedUser, history, loginPrefix])

  const chatHandler = useCallback(() => {
    window.open(`http://localhost:4000`, '_blank')
  }, [])

  const lougoutHandler = useCallback(async () => {
    if (authStore.loggedUser) {
      if (window.$chatwoot) {
        window.$chatwoot.reset()
        window.location.reload()
      }
      const response = authStore.logout()
      if (response === ResponseStatus.SUCCESS) {
        history.push(`/${loginPrefix}/login`)
      }
    }
  }, [authStore, history, loginPrefix])

  useEffect(() => {
    if (loginPrefix === LayoutType.ADMIN) {
      lawyerStore.currentLawyer && setName(lawyerStore.currentLawyer.name)
    } else {
      clientStore.currentUser && setName(clientStore.currentUser.name.split(' ')[0])
    }
  }, [lawyerStore.currentLawyer, clientStore.currentUser, loginPrefix])

  /* useEffect(() => {
    if (authStore.loggedUser) {
      // console.log(loginPrefix)
      if (loginPrefix === LayoutType.ADMIN) {
        lawyerStore.loadLawyer(authStore.loggedUser._id)
      } else {
        clientStore.loadClient(authStore.loggedUser._id)
      }
    }
  }, [authStore, lawyerStore, clientStore, loginPrefix]) */

  return (
    <Header className="custom-header">
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginLeft: '-30px',
          }}
        >
          {authStore.loggedUser && (
            <FontAwesomeIcon
              icon={faSignOutAlt}
              size="2x"
              color={MATERIAL_ICON_COLOR}
              style={{ cursor: 'pointer' }}
              onClick={lougoutHandler}
            />
          )}
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={Logo} alt="Logo" />
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginRight: '-30px',
          }}
        >
          {authStore.loggedUser ? (
            <div>
              <Tooltip title={name}>
                <FontAwesomeIcon
                  icon={faUser}
                  color={authStore.loggedUser ? MATERIAL_ICON_COLOR : BOCAYUVA_BLUE_COLOR}
                  size="2x"
                  style={{ cursor: 'pointer' }}
                  onClick={loginHandler}
                />
              </Tooltip>
              <Tooltip title={'Chat'}>
                <FontAwesomeIcon
                  icon={faComment}
                  color={authStore.loggedUser ? MATERIAL_ICON_COLOR : BOCAYUVA_BLUE_COLOR}
                  size="2x"
                  style={{ cursor: 'pointer', marginLeft: '10px' }}
                  onClick={chatHandler}
                />
              </Tooltip>
            </div>
          ) : (
            <FontAwesomeIcon
              icon={faUser}
              color={authStore.loggedUser ? MATERIAL_ICON_COLOR : BOCAYUVA_BLUE_COLOR}
              size="2x"
              style={{ cursor: 'pointer' }}
              onClick={loginHandler}
            />
          )}
        </div>
      </div>
    </Header>
  )
})

export default memo(GlobalHeader)
