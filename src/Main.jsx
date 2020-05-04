import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import {
  BrowserRouter as Router,
  Switch, Route, Link
} from "react-router-dom"
import Home from './pages/Home.jsx'
import Admin from './pages/Admin.jsx'
import Menu from './pages/Menu.jsx'
import Settings from './pages/Settings.jsx'
import OrderPage from './pages/OrderPage.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import './assets/styles/main.scss'
import { IMAGES } from './config'
import db from '../db.json'


import scroll from './services/helpers'

import smoothscroll from 'smoothscroll-polyfill';

// Services
import userContext from './services/userContext'
import productService from './services/products'
import categoriesService from './services/categories'
import resetDB from './services/resetDB'
import loginService from './services/login'
import usersService from './services/users'


// Hooks
import useField from './hooks/fieldHook'
import useOnScreen from './hooks/onScreenHook'

// Components
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PictureModal from './components/PictureModal.jsx'

import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_live_aitrgN8xuZYpG1EPcB1BlHF4');

smoothscroll.polyfill();


const Main = (props) => {

  // useEffect(() => {
  //   if (user) {
  //     servicesSetToken(user.token)
  //   } 
  // }, [])

  const servicesSetToken = (token) => {
    console.log('Services token: ', token)
    productService.setToken(token)
    usersService.setToken(token)
    categoriesService.setToken(token)
  }


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
              <Route exact path="/order">
                <OrderPage />
              </Route>
              <Route exact path="/">
                <Home />
              </Route>
            </Switch>
          </div>
        )}}
      </userContext.Consumer>
    </Elements>
  )
}

export default Main