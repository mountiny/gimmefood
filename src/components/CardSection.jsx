import React from 'react'
import {CardElement} from '@stripe/react-stripe-js';

const CardSection = ({className, options}) => {
  return (
    <CardElement id='card' className={className} options={options} />
  )
}

export default CardSection