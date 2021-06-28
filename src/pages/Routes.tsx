import React from 'react'
import { Route, Redirect } from 'react-router-dom'

import { isAuthenticated } from '~/services/storage/auth'
import { observer } from 'mobx-react-lite'
import { useStores } from '~/hooks/use-stores'
import { hasClient, hasAdmin, hasLawyer } from '~/utils/route-utils'

export const LandingRoute = observer(({ component: Component, ...config }: any) => {
  const { authStore } = useStores()

  const checkLogged = isAuthenticated() && hasClient(authStore.loggedUser)

  return (
    <Route
      {...config}
      render={(props: any) =>
        checkLogged ? (
          <Redirect to={{ pathname: '/client/menu', state: { from: props.location } }} />
        ) : (
          <Component {...props} />
        )
      }
    />
  )
})

export const PreAuthRoute = observer(({ component: Component, ...config }: any) => {
  const { clientStore, authStore } = useStores()

  const check = clientStore.currentUser !== undefined

  const checkLogged = isAuthenticated() && hasClient(authStore.loggedUser)

  return (
    <Route
      {...config}
      render={(props: any) =>
        check ? (
          checkLogged ? (
            <Redirect to={{ pathname: '/client/menu', state: { from: props.location } }} />
          ) : (
            <Component {...props} />
          )
        ) : (
          <Redirect to={{ pathname: '/client  ', state: { from: props.location } }} />
        )
      }
    />
  )
})

export const PrivateRoute = observer(({ component: Component, ...config }: any) => {
  const { authStore } = useStores()

  const check =
    isAuthenticated() && !hasLawyer(authStore.loggedUser) && hasClient(authStore.loggedUser)

  return (
    <Route
      {...config}
      render={(props: any) =>
        check ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/client/login', state: { from: props.location } }} />
        )
      }
    />
  )
})

export const AdminRoute = observer(({ component: Component, ...config }: any) => {
  const { authStore } = useStores()

  const check = isAuthenticated() && hasLawyer(authStore.loggedUser)

  return (
    <Route
      {...config}
      render={(props: any) =>
        check ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/admin/login', state: { from: props.location } }} />
        )
      }
    />
  )
})

export const SuperAdminRoute = observer(({ component: Component, ...config }: any) => {
  const { authStore } = useStores()

  const check = isAuthenticated() && hasAdmin(authStore.loggedUser)

  return (
    <Route
      {...config}
      render={(props: any) =>
        check ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/admin/login', state: { from: props.location } }} />
        )
      }
    />
  )
})
