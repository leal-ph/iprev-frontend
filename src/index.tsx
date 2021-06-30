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
import ClientBenefitsScreen from './pages/client/benefits/BenefitsScreen'
import AdditionalForm from './pages/client/presentation/AdditionalForm'
import RegisterSuccessScreen from './pages/client/main/RegisterSuccessScreen'
import AceiteScreen from './pages/client/main/AceiteScreen'
import ContractScreen from './pages/client/main/ContractScreen'
import PaymentScreen from './pages/client/payment/PaymentScreen'
import MenuClientScreen from './pages/client/main/MenuClientScreen'
import CalendarClientScreen from '~/pages/client/calendar/CalendarScreen'
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
import ProfilesScreen from './pages/admin/client/BenefitsScreen'

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <LandingRoute path="/" exact component={Client} />
      <LandingRoute path="/client" exact component={Client} />
      <Route path="/client/login" component={ClientLoginScreen} />
      <Route path="/admin/login" component={AdminLoginScreen} />
      <AdminRoute path="/admin" exact component={MenuScreen} />
      <PreAuthRoute path="/client/form" component={LifeContribForm} />
      <PreAuthRoute path="/client/additional" component={AdditionalForm} />
      <PrivateRoute path="/client/registersuccess" component={RegisterSuccessScreen} />
      <PrivateRoute path="/client/benefit" component={ClientBenefitsScreen} />
      <PrivateRoute path="/client/aceite" component={AceiteScreen} />
      <PrivateRoute path="/client/contract" component={ContractScreen} />
      <PrivateRoute path="/client/payment" component={PaymentScreen} />
      <PrivateRoute path="/client/calendar" component={CalendarClientScreen} />
      <PrivateRoute path="/client/menu" component={MenuClientScreen} />
      <PrivateRoute path="/client/documents/sign" component={SignScreen} />
      <PrivateRoute path="/client/lawsuits" component={LawsuitScreen} />
      <PrivateRoute path="/client/profile" component={ClientProfile} />
      <AdminRoute path="/admin/calendar" component={CalendarAdminScreen} />
      <AdminRoute path="/admin/clients" exact component={ClientScreen} />
      <SuperAdminRoute path="/admin/lawyers" component={AdminScreen} />
      <AdminRoute path="/admin/clients/info" component={ClientInfoScreen} />
      <AdminRoute path="/admin/recover" component={AdminNewPassScreen} />
      <AdminRoute path="/admin/lawsuits" component={LawsuitListScreen} />
      <AdminRoute path="/admin/profile" component={LawyerProfile} />
      <AdminRoute path="/admin/benefits" component={ProfilesScreen} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root'),
)
