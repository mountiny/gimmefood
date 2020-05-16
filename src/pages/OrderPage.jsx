import React, { useState, useEffect, useRef } from 'react'
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import axios from 'axios'
import '../assets/styles/main.scss'
import { IMAGES } from '../config'
import { Link, Redirect, useHistory, useParams } from "react-router-dom"
import productService from '../services/products'
import categoriesService from '../services/categories'
import resetDB from '../services/resetDB'
import stripeService from '../services/stripe'
import db from '../../db.json'

// Hooks
import useField from '../hooks/fieldHook'

// Components
import ScrollToTop from '../components/ScrollToTop.jsx'
import CardSection from '../components/CardSection.jsx'
import UnderlineText from '../components/UnderlineText.jsx'

const OrderPage = () => {

  const slug = useParams().business
  const LSKey = `${slug}-order`

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [delivery, setDelivery] = useState(0)
  const [order, setOrder] = useState(
    window.localStorage.getItem(LSKey) 
    ? JSON.parse(window.localStorage.getItem(LSKey)) 
    : null)

  const [user, setUser] = useState(window.localStorage.getItem(`${slug}-data`) 
  ? JSON.parse(window.localStorage.getItem(`${slug}-data`)) 
  : null)
  
  const name = useField("name")
  const phone = useField("phone")
  const email = useField("email")
  const note = useField("note")

  const history = useHistory()


  const stripe = useStripe();
  const elements = useElements();

  // Get all products
  useEffect( () => {
    getOrder()
  }, [])

  const getOrder = () => {
    const new_order = JSON.parse(window.localStorage.getItem(LSKey))
    if (new_order) {
      setOrder(order)
    }
  }

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get client sected

    const sekred = stripeService.getStripeSecred()

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    // const cardElement = elements.getElement(CardElement);

    // Use your card Element with other Stripe.js APIs
    // const {error, paymentMethod} = await stripe.createPaymentMethod({
    //   type: 'card',
    //   card: cardElement,
    // });
    const result = await stripe.confirmCardPayment(sekred, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: 'Jenny Rosen',
        },
      }
    });

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  };

  const CARD_OPTIONS = {
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
  };

  if (!user || !order) {
    return <Redirect to={`/${slug}`} />
  } else {
    return (
        <div className="app-wrapper">
          <ScrollToTop />
          <div className="container">

            <div className="block pay-block">
              <div className="h-pointer back-link h-rounded h-margin-bottom"
                onClick={()=> history.goBack()}>
              Go back
              </div>
              <UnderlineText className='h-margin-bottom'>
                <h3 className="block-heading h-700">Your Order</h3>
              </UnderlineText>

              <div className="order-summary">
                <div className="order-line">
                  <div className="order-item__list">
                    <div className="order-item"><b>2x Breads</b> - Rye Bread</div>
                    <div className="order-item"><b>1x Coffee</b> - Karinga AA - Kenya</div>
                  </div>
                  <div className="order-total h-700">
                    <div className="order-total__text">Total</div>
                    <div className="order-total__price">£14.98</div>
                  </div>
                </div> 
              </div>
              <div onClick={() => setDelivery(0)} className={delivery === 0 ? "collection-way h-pointer h-rounded h-selected" : "collection-way h-pointer h-rounded"}>
                <h4>Colect it!</h4><br />
                On Friday at our bakery in Whiteinch<br />
                <a href="https://www.google.com/maps/place/Kaf+Bakery/@55.8726385,-4.3385814,17.99z/data=!4m5!3m4!1s0x488845202c15cfc7:0xfa84b991fb493ce9!8m2!3d55.8726425!4d-4.3392626" target="_blank">Click here for location of the bakery!</a>
              </div>
              {/* <div onClick={() => setDelivery(1)} className={delivery === 1 ? "collection-way h-pointer h-rounded h-selected" : "collection-way h-pointer h-rounded"}>
                <h4>Deliver it to me!</h4><br />
                Give us your address and we will deliver your order on Friday evening
              </div> */}
              <form className="order-form" onSubmit={handleSubmit}>
                <div className="form-line">
                  <input
                    id="name"
                    className="h-rounded"
                    type="text"
                    placeholder="Name"
                    value={name.value}
                    onChange={(e) => name.onChange(e)}
                  />
                </div>
                <div className="form-line">
                  <input
                    id="phone"
                    className="h-rounded"
                    type="telephone"
                    placeholder="Mobile phone"
                    value={phone.value}
                    onChange={(e) => phone.onChange(e)}
                  />
                </div>
                <div className="form-line">
                  <input
                    id="email"
                    className="h-rounded"
                    type="email"
                    placeholder="Email"
                    value={email.value}
                    onChange={(e) => email.onChange(e)}
                  />
                </div>
                <div className="form-line">
                  <input
                    id="note"
                    className="h-rounded"
                    type="text"
                    placeholder="Note for us"
                    value={note.value}
                    onChange={(e) => note.onChange(e)}
                  />
                </div>
                <CardSection className="h-rounded" options={CARD_OPTIONS}/>
                <div className="form-line error-message"></div>
                {/* <CardElement className="h-rounded" options={CARD_OPTIONS} /> */}
                <button disabled={!stripe} className="order-btn h-button h-rounded h-pointer" type="submit">
                  Order & Pay
                </button>
                {/* <button className="order-btn h-button h-rounded h-pointer" type="submit">Order</button> */}
              </form>
            </div>
            <div className="block footer">
              <div>
                Created by <a href="https://www.mountiny.com" target="_blank">Mountiny - Vit Horacek</a>
              </div>
              <a className="mountiny-logo" href="https://www.mountiny.com" target="_blank">
                <img src={IMAGES + "logo_ant.png"} alt="Mountiny"/>
              </a>

            </div>
          </div>
        </div>
      )
    }
}

export default OrderPage