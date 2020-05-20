import React, { useState, useEffect, useRef } from 'react'
import { CardElement, useStripe, useElements, PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import '../assets/styles/main.scss'
import { Redirect, useHistory, useParams, matchPath } from "react-router-dom"
import stripeService from '../services/stripe'
import db from '../../db.json'
import { loadStripe } from '@stripe/stripe-js';

// Hooks
import useField from '../hooks/fieldHook'

// Components

// Pages
import OrderPage from './OrderPage.jsx'

import { Elements } from '@stripe/react-stripe-js';
// import {loadStripe} from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
var stripePromise = null;

console.log('When od I rund')

const getAccountId = () => {
   
  let intent_slug = matchPath(window.location.pathname, {
    path: "/:slug/order",
    exact: true,
    strict: false
  })
  
  if (intent_slug) {
    intent_slug = intent_slug.params
  }
  
  if (intent_slug) {
    console.log('intent: ', intent_slug)
  
    stripeService.getAccontId(intent_slug).then((res) => {
      console.log('Stripe id response: ', res)
      stripePromise = loadStripe('pk_test_Wbc2Nkrekp0GuKGTDmdMkZyp', 
        { stripeAccount: res.stripe_id });
    })
    
  }

}

const OrderPageWrapper = () => {

  // If the promise does not exist yet, call fucnction to creat ie
  if (!stripePromise) {
    getAccountId()
  }

  return (
    <Elements stripe={stripePromise}>
      <OrderPage />
    </Elements>
    )

}

export default OrderPageWrapper