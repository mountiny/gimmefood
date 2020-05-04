import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import {
  BrowserRouter as Router,
  Switch, Route, Link
} from "react-router-dom"
import Main from './Main.jsx'
import Admin from './pages/Admin.jsx'
import Menu from './pages/Menu.jsx'
import Settings from './pages/Settings.jsx'
import OrderPage from './pages/OrderPage.jsx'
import Login from './pages/Login.jsx'
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


const App = ({LSUser}) => {

  const [user, setUser] = useState(LSUser)

  useEffect(() => {
    if (user) {
      servicesSetToken(user.token)
    } 
  }, [changeUser])

  const changeUser = (new_user) => {
    setUser(new_user)
  }

  const servicesSetToken = (token) => {
    // console.log('Services token: ', token)
    productService.setToken(token)
    usersService.setToken(token)
    categoriesService.setToken(token)
  }

  const value = {
    user: user,
    changeUser: changeUser
  }

  return (
    <userContext.Provider value={value}>
      <Main/>
    </userContext.Provider>
  )

}

export default App