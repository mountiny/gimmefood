import React, { useState, useEffect, useRef } from 'react'
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import axios from 'axios'
import '../assets/styles/main.scss'
import { IMAGES } from '../config'
import { Link, Redirect, useHistory, useParams, matchPath } from "react-router-dom"
import productService from '../services/products'
import categoriesService from '../services/categories'
import resetDB from '../services/resetDB'
import stripeService from '../services/stripe'
import db from '../../db.json'
import {loadStripe} from '@stripe/stripe-js';

// Hooks
import useField from '../hooks/fieldHook'

// Components
import ScrollToTop from '../components/ScrollToTop.jsx'
import CardSection from '../components/CardSection.jsx'
import UnderlineText from '../components/UnderlineText.jsx'
import AppFooter from '../components/AppFooter.jsx'

// let intent_slug = matchPath(window.location.pathname, {
//   path: "/:slug/order",
//   exact: true,
//   strict: false
// })

// if (intent_slug) {
//   intent_slug = intent_slug.params
// }

// const createIntent = async () => {
//   const basket= JSON.parse(window.localStorage.getItem(`${intent_slug.slug}-basket`))
//   const thisUser = {
//     slug: intent_slug.slug,
//     basket
//   }
//   const response = await stripeService.getIntent(thisUser)
//   console.log('Response: ', response)
//   return response
//   // const {client_secret: clientSecret} = await response.json()
// }

// (async () => {
//   const response = await createIntent();
//   const {client_secret: clientSecret, stripe_id } = response;
//   console.log('client secret: ', stripe_id)
//   // Call stripe.confirmCardPayment() with the client secret.
// })();

const OrderPage = () => {

  const slug = useParams().business
  const LSBasketKey = `${slug}-basket`
  const LSPriceKey = `${slug}-price`

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [clientS, setClientS] = useState('')
  const [stripeID, setStripeID] = useState('')
  const [submitBtn, setSubmitBtn] = useState('Order & Pay')
  // const [delivery, setDelivery] = useState(0)
  const [price, setPrice] = useState(
    window.localStorage.getItem(LSPriceKey) 
    ? parseFloat(JSON.parse(window.localStorage.getItem(LSPriceKey)))
    : 0
  )
  const [basket, setBasket] = useState(
    window.localStorage.getItem(LSBasketKey) 
    ? JSON.parse(window.localStorage.getItem(LSBasketKey)) 
    : null)

  const [user, setUser] = useState(window.localStorage.getItem(`${slug}-data`) 
  ? JSON.parse(window.localStorage.getItem(`${slug}-data`)) 
  : null)

  console.log('User: ', user)
  
  const name = useField("name")
  // const phone = useField("phone")
  const email = useField("email")
  const note = useField("note")

  const history = useHistory()


  const stripe = useStripe();
  const elements = useElements();

  // Get all products
  useEffect( () => {
    getBasket()
    createIntent()
  }, [])

  const getBasket = () => {
    const new_basket = JSON.parse(window.localStorage.getItem(LSBasketKey))
    if (new_basket) {
      setBasket(new_basket)
    }
  }

  const createIntent = async () => {
    const basket= JSON.parse(window.localStorage.getItem(LSBasketKey))
    const thisUser = {
      slug,
      basket
    }
    const response = await stripeService.getIntent(thisUser)
    console.log('Response: ', response)
    // const {client_secret: clientSecret, stripe_id } = response;
    setClientS(response.client_secret)
    setStripeID(response.stripe_id)
    // const {client_secret: clientSecret} = await response.json()
  }

// (async () => {
//   const response = await createIntent();
//   const {client_secret: clientSecret, stripe_id } = response;
//   console.log('client secret: ', stripe_id)
//   // Call stripe.confirmCardPayment() with the client secret.
// })();
  // const createIntent = async () => {
  //   const basket= JSON.parse(window.localStorage.getItem(LSBasketKey))
  //   const thisUser = {
  //     slug,
  //     basket
  //   }
  //   const response = await stripeService.getIntent(thisUser)
  //   const {client_secret: clientSecret} = await response.json()
  // }

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements || clientS === '' || submitBtn === 'Processing...') {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return
    }

    if (name.value === '') {
      alert("You have not filled in your name!")
      return
    }

    // Get client sected

    setSubmitBtn('Processing...')

    const result = await stripe.confirmCardPayment(clientS, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: name.value,
        },
      }
    });

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message)
      alert(result.error.message)
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        setSubmitBtn('Successfully paid')
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
        iconColor: '#1c2153',
        backgroundColor: '#fdeceb',
        color: '#1c2153',
        fontWeight: 500,
        fontFamily: 'Lato, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        ':-webkit-autofill': {color: '#1c2153'},
        '::placeholder': {color: '#1c2153'},
      },
      invalid: {
        iconColor: '#FF545F',
        color: '#1c2153',
      },
    },
  };

  if (!user || !basket || price === 0) {
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
                    {
                      user.categories.map((category) => {
                        return (
                          category.products.map((product) => {
                            if (basket[product.id]) {
                              return (
                                <div className="order-item" key={product.id}>
                                  <div className="order-item__details"><b>{basket[product.id]}x {category.name}</b>&nbsp;- {product.name}</div>
                                  <div className="order-item__price">£{parseFloat((product.price*basket[product.id])/100).toFixed(2)}</div>
                                </div>
                              )
                            }
                          })
                        )
                      })
                    }
                  </div>
                  <div className="order-total h-700">
                    <div className="order-total__text">Total</div>
                    <div className="order-total__price">£{parseFloat(price).toFixed(2)}</div>
                  </div>
                </div> 
              </div>
              <a 
                className="collection-way h-pointer h-rounded"
                href="https://www.google.com/maps/place/Kaf+Bakery/@55.8726385,-4.3385814,17.99z/data=!4m5!3m4!1s0x488845202c15cfc7:0xfa84b991fb493ce9!8m2!3d55.8726425!4d-4.3392626" target="_blank"
                >
                <h4>Collect it!</h4><br />
                On Friday at our bakery in Whiteinch
                <br /><br />
                Click here to show place on a map.
                {/* <a href="https://www.google.com/maps/place/Kaf+Bakery/@55.8726385,-4.3385814,17.99z/data=!4m5!3m4!1s0x488845202c15cfc7:0xfa84b991fb493ce9!8m2!3d55.8726425!4d-4.3392626" target="_blank">Click here for location of the bakery!</a> */}
              </a>
              {/* <div onClick={() => setDelivery(1)} className={delivery === 1 ? "collection-way h-pointer h-rounded h-selected" : "collection-way h-pointer h-rounded"}>
                <h4>Deliver it to me!</h4><br />
                Give us your address and we will deliver your order on Friday evening
              </div> */}
              <form className="order-form" onSubmit={handleSubmit}>
                <div className="form-line">
                  <label htmlFor="name">Your name:</label>
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
                  <label htmlFor="email">Email to send receipt to:</label>
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
                  <label htmlFor="note">Note for us:</label>
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
                  {submitBtn}
                </button>
                {/* <button className="order-btn h-button h-rounded h-pointer" type="submit">Order</button> */}
              </form>
            </div>
            
            <AppFooter />
          </div>
        </div>
      )
    }
}

export default OrderPage