import React from 'react'

// Import com parâmetro que precisa ser persistido
import authStore from './auth-store'

import AdminStore from './admin-store'
import ClientStore from './client-store'
import LawyerStore from './lawyer-store'
import PaymentStore from './payment-store'
import DocumentStore from './document-store'
import MeetingStore from './meeting-store'
import MeetStore from './meet-store'
import LawsuitStore from './lawsuit-store'
import BenefitStore from './benefit-store'
import MSGraphStore from './msgraph-store'
import GroupStore from './group-store'
import SharepointStore from './sharepoint-store'

export const storesContext = React.createContext({
  authStore,
  adminStore: new AdminStore(),
  clientStore: new ClientStore(),
  lawyerStore: new LawyerStore(),
  paymentStore: new PaymentStore(),
  documentStore: new DocumentStore(),
  meetingStore: new MeetingStore(),
  meetStore: new MeetStore(),
  benefitStore: new BenefitStore(),
  msgraphStore: new MSGraphStore(),
  lawsuitStore: new LawsuitStore(),
  groupStore: new GroupStore(),
  sharepointStore: new SharepointStore(),
})
