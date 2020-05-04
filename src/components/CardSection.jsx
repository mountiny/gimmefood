import React from 'react'
import {CardElement} from '@stripe/react-stripe-js';

const CARD_ELEMENT_OPTIONS = {
  iconStyle: 'solid',
  style: {
    base: {
      iconColor: '#0F122D',
      backgroundColor: '#F1F5F9',
      color: '#0F122D',
      fontWeight: 500,
      fontFamily: 'Lato, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      ':-webkit-autofill': {color: '#0F122D'},
      '::placeholder': {color: '#0F122D'},
    },
    invalid: {
      iconColor: '#FF545F',
      color: '#0F122D',
    },
  },
}

const CardSection = ({className}) => {
  return (
    <CardElement className={className} options={CARD_ELEMENT_OPTIONS} />
  )
}

export default CardSection