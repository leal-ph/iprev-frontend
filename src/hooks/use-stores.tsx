import React from 'react'
import { storesContext } from '~/services/mobx/index'

export const useStores = () => React.useContext(storesContext)
