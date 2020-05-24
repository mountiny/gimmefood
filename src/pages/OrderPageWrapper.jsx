import React, { useState, useEffect } from 'react'
import '../assets/styles/main.scss'
import { useParams, matchPath } from "react-router-dom"
import stripeService from '../services/stripe'
import { loadStripe } from '@stripe/stripe-js';

// Hooks

// Components

// Pages
import OrderPage from './OrderPage.jsx'

import { Elements } from '@stripe/react-stripe-js';
// import {loadStripe} from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.

const getAccountId = async () => {
   
  let intent_slug = matchPath(window.location.pathname, {
    path: "/:slug/order",
    exact: true,
    strict: false
  })
  
  if (intent_slug) {
    intent_slug = intent_slug.params
  }
  
  if (intent_slug) {

  
    const res = await stripeService.getAccontId(intent_slug)

    const promise = loadStripe('pk_test_Wbc2Nkrekp0GuKGTDmdMkZyp', { stripeAccount: res.stripe_id })

    window.localStorage.setItem(`${intent_slug}-stripePromise`, JSON.stringify(promise))
    return promise
    
  }

}

const OrderPageWrapper = () => {

  const slug = useParams().business

  const [promise, setPromise] = useState(window.localStorage.getItem(`${slug}-stripePromise`) ? JSON.parse(window.localStorage.getItem(`${slug}-stripePromise`)) : null)

  // If the promise does not exist yet, call fucnction to creat ie
  useEffect(() => {
    if (!promise) {
      const newPromise = getAccountId()

      setPromise(newPromise)
    }
  }, [])

  return (
    <Elements stripe={promise}>
      <OrderPage />
    </Elements>
    )

}

export default OrderPageWrapper