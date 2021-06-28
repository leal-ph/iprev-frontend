import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import '~/assets/styles/App.less'

// import App from '~/pages'
// import Admin from '~/pages/admin'
import Client from '~/pages/client'
import MenuScreen from '~/pages/admin/main/MenuScreen'
import CalendarAdminScreen from '~/pages/admin/calendar/CalendarScreen'
import ClientScreen from '~/pages/admin/client/ClientListScreen'
import AdminScreen from '~/pages/admin/lawyer/AdminScreen'
import ClientInfoScreen from '~/pages/admin/client/ClientInfoScreen'
import LawsuitListScreen from '~/pages/admin/lawyer/LawsuitListScreen'
import AdminLoginScreen from '~/pages/admin/AdminLoginScreen'
import AdminNewPassScreen from './pages/admin/AdminNewPassScreen'
import LifeContribForm from './pages/client/presentation/LifeContribForm'
import BenefitsForm from './pages/client/presentation/BenefitsForm'
import AdditionalForm from './pages/client/presentation/AdditionalForm'
import RegisterSuccessScreen from './pages/client/main/RegisterSuccessScreen'
import AceiteScreen from './pages/client/main/AceiteScreen'
import ContractScreen from './pages/client/main/ContractScreen'
import PaymentScreen from './pages/client/payment/PaymentScreen'
import MenuClientScreen from './pages/client/main/MenuClientScreen'
import CalendarClientScreen from '~/pages/client/calendar/CalendarScreen'
import AttachDocuments from './pages/client/document/AttachDocuments'
import ClientLoginScreen from '~/pages/client/ClientLoginScreen'
import LawsuitScreen from './pages/client/lawsuit/LawsuitScreen'
import SignScreen from './pages/client/document/SignScreen'

import {
  PreAuthRoute,
  PrivateRoute,
  AdminRoute,
  SuperAdminRoute,
  LandingRoute,
} from './pages/Routes'
import ClientProfile from './pages/client/ClientProfile'
import LawyerProfile from './pages/admin/LawyerProfile'
import ProfilesScreen from './pages/admin/client/ProfilesScreen'

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <LandingRoute path="/" exact component={Client} />
      <LandingRoute path="/client" exact component={Client} />
      <Route path="/client/login" component={ClientLoginScreen} />
      <Route path="/admin/login" component={AdminLoginScreen} />
      <Route path="/admin" exact component={MenuScreen} />
      <Route path="/client/form" component={LifeContribForm} />
      <Route path="/client/additional" component={AdditionalForm} />
      <Route path="/client/benefits" component={BenefitsForm} />
      <Route path="/client/registersuccess" component={RegisterSuccessScreen} />
      <Route path="/client/aceite" component={AceiteScreen} />
      <Route path="/client/contract" component={ContractScreen} />
      <Route path="/client/payment" component={PaymentScreen} />
      <Route path="/client/calendar" component={CalendarClientScreen} />
      <Route path="/client/menu" component={MenuClientScreen} />
      <Route path="/client/documents" exact component={AttachDocuments} />
      <Route path="/client/documents/sign" component={SignScreen} />
      <Route path="/client/lawsuits" component={LawsuitScreen} />
      <Route path="/client/profile" component={ClientProfile} />
      <Route path="/admin/calendar" component={CalendarAdminScreen} />
      <Route path="/admin/clients" exact component={ClientScreen} />
      <Route path="/admin/lawyers" component={AdminScreen} />
      <Route path="/admin/clients/info" component={ClientInfoScreen} />
      <Route path="/admin/recover" component={AdminNewPassScreen} />
      <Route path="/admin/lawsuits" component={LawsuitListScreen} />
      <Route path="/admin/profile" component={LawyerProfile} />
      <Route path="/admin/profiles" component={ProfilesScreen} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root'),
)
