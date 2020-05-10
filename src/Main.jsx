import React, { useState, useEffect, useRef } from 'react'
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
import OrderPage from './pages/OrderPage.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import LandingPage from './pages/LandingPage.jsx'

import smoothscroll from 'smoothscroll-polyfill';

// Services
import userContext from './services/userContext'
import productService from './services/products'
import categoriesService from './services/categories'
import usersService from './services/users'

// Components
import ProtectedRoute from './components/ProtectedRoute.jsx'

import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';


// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_live_aitrgN8xuZYpG1EPcB1BlHF4');

smoothscroll.polyfill();


const Main = (props) => {

  return (
    <Elements stripe={stripePromise}>
      <userContext.Consumer>
        {({user, changeUser}) => {
          return (
          <div className="main-container">
            <Switch>
              {/* <Route path="/admin/menu">
                <Menu />
              </Route> */}
              <ProtectedRoute path="/admin/menu" user={user} component={Menu}/>
              {/* <Route path="/admin/settings">
                <Settings />
              </Route> */}
              <ProtectedRoute path="/admin/settings/edit" user={user} changeUser={changeUser} component={EditProfile}/>

              <ProtectedRoute path="/admin/settings" user={user} changeUser={changeUser} component={Settings}/>
              {/* <Route exact path="/admin">
                <Admin />
              </Route> */}
              <ProtectedRoute path="/admin" user={user} component={Admin}/>
              <Route exact path="/login">
                <Login user={user} changeUser={changeUser} />
              </Route>
              <Route exact path="/signup">
                <Signup user={user} />
              </Route>
              {/* <Route exact path="/login">
                <Admin />
              </Route> */}
              <Route exact path="/:business/order">
                <OrderPage />
              </Route>
              <Route exact path="/:business">
                <Home />
              </Route>
              <Route exact path="/">
                <LandingPage />
              </Route>
            </Switch>
          </div>
        )}}
      </userContext.Consumer>
    </Elements>
  )
}

export default Main