import React, { useState, useEffect } from 'react'
import Main from './Main.jsx'
import './assets/styles/main.scss'
import smoothscroll from 'smoothscroll-polyfill';

// Services
import userContext from './services/userContext'
import productService from './services/products'
import categoriesService from './services/categories'
import usersService from './services/users'

// Hooks

// Components

// Stripe
// import {Elements} from '@stripe/react-stripe-js';
// import {loadStripe} from '@stripe/stripe-js';

// // Make sure to call `loadStripe` outside of a component’s render to avoid
// // recreating the `Stripe` object on every render.
// const stripePromise = loadStripe('pk_test_Wbc2Nkrekp0GuKGTDmdMkZyp');

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
      {/* <Elements stripe={stripePromise}> */}
        <Main/>
      {/* </Elements> */}
    </userContext.Provider>
  )

}

export default App