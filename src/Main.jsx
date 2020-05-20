import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch, Route, Link
} from "react-router-dom"

// Styles
import './assets/styles/main.scss'

// Pages
import Home from './pages/Home.jsx'
import Admin from './pages/Admin.jsx'
import Menu from './pages/Menu.jsx'
import Settings from './pages/Settings.jsx'
import EditProfile from './pages/EditProfile.jsx'
import OrderPageWrapper from './pages/OrderPageWrapper.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import LandingPage from './pages/LandingPage.jsx'

import smoothscroll from 'smoothscroll-polyfill';

// Services
import userContext from './services/userContext'

// Components
import ProtectedRoute from './components/ProtectedRoute.jsx'


// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// const stripePromise = loadStripe('pk_test_Wbc2Nkrekp0GuKGTDmdMkZyp');

smoothscroll.polyfill();


const Main = (props) => {

  const [stripeId, setStripeId] = useState('')

  return (
    // <Elements stripe={stripePromise}>
      <userContext.Consumer>
        {({user, changeUser}) => {
          return (
          <div className="main-container">
            <Switch>
              <ProtectedRoute 
                path="/admin/menu" 
                user={user} 
                component={Menu}/>
              <ProtectedRoute 
                path="/admin/settings/edit" 
                user={user} 
                changeUser={changeUser} 
                component={EditProfile}/>
              <ProtectedRoute 
                path="/admin/settings" 
                user={user} 
                changeUser={changeUser} 
                component={Settings}/>
              <ProtectedRoute 
                path="/admin" 
                user={user} 
                component={Admin}/>
              <Route exact path="/login">
                <Login user={user} changeUser={changeUser} />
              </Route>
              <Route exact path="/signup">
                <Signup user={user} />
              </Route>
              <Route exact path="/:business/order">
                <OrderPageWrapper />
                {/* <OrderPage stripeId={stripeId} changeStripeId={(id) => setStripeId(id)} /> */}
              </Route>
              <Route exact path="/:business">
                <Home stripeId={stripeId} changeStripeId={(id) => setStripeId(id)} />
              </Route>
              <Route exact path="/">
                <LandingPage />
              </Route>
            </Switch>
          </div>
        )}}
      </userContext.Consumer>
    // </Elements>
  )
}

export default Main