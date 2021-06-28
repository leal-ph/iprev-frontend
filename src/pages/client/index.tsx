import React, { memo } from 'react'
import ClientLayout from '~/pages/GlobalLayout'
import BasicForm from './presentation/BasicForm'

const Client = () => {
  return <ClientLayout content={<BasicForm />} />
}

export default memo(Client)
