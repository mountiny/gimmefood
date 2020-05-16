import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Link, Redirect, useParams } from "react-router-dom"
import usersService from '../services/users'

import scroll from '../services/helpers'

import smoothscroll from 'smoothscroll-polyfill';

// Hooks
import useOnScreen from '../hooks/onScreenHook'
import useScroll from '../hooks/scrollHook'

// Components
import PictureModal from '../components/PictureModal.jsx'
import CategoryWrapper from '../components/CategoryWrapper.jsx'
import UnderlineText from '../components/UnderlineText.jsx'

smoothscroll.polyfill();

const useProducts = (url) => {
  const [products, setProducts] = useState([])
  useEffect(() => {
    axios.get(url).then(response => {
      setProducts(response.data)
    })
  }, [url])
  return products
}

const Home = () => {

  const slug = useParams().business
  const LSOrderKey = `${slug}-order`
  const LSDataKey = `${slug}-data`

  const [counter, setCounter] = useState(0)
  const [price, setPrice] = useState(0)
  const [amount, setAmount] = useState(0)
  const [modalPic, setModalPic] = useState("")
  const [basket, setBasket] = useState(window.localStorage.getItem(LSOrderKey) ? JSON.parse(window.localStorage.getItem(LSOrderKey)) : {})
  const [productShown, setProductShown] = useState({
    name: "Sourdough Bread",
    description: "This is a description of this lovely and crunchy bread.",
    price: 3.00,
    stock: 30,
    date: "2020-05-02T07:43:26.537Z",
    hidden: false,
    order: 1,
    allergens: [1,3,4],
    category: "asděšr123",
    user: "asdšda"
  })
  const [values, setValues] = useState([])
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState(window.localStorage.getItem(LSDataKey) ? JSON.parse(window.localStorage.getItem(LSDataKey)).categories : null)
  const [user, setUser] = useState(window.localStorage.getItem(LSDataKey) ? JSON.parse(window.localStorage.getItem(LSDataKey)) : null)
  const [order, setOrder] = useState({})
  const [modal, setModal] = useState(false)

  const [error, setError] = useState(null)

  const productRef = useRef(null)
  const logoRef = useRef(null)

  const fromTop = useScroll()

  // Get all products
  useEffect( () => {
    getData()
    getOrder()
  }, [])

  const getData = async () => {
    const params = { slug: slug }
    try {
      const response = await usersService.getCategories(params)
      saveDataToLS(response)
      console.log('Response: ', response)
      setUser(response)
      setCategories(response.categories)
    } catch (e) {
      setError(e.response.status)
    }
  }

  const saveDataToLS = (cat) => {
    window.localStorage.setItem(
      LSDataKey, JSON.stringify(cat)
    )
  }

  const getOrder = () => {
    const new_order = JSON.parse(window.localStorage.getItem(LSOrderKey))
    if (new_order) {
      setOrder(order)
    }
  }

  const saveOrder = (temp_order) => {
    // const order = {"order": order}
    window.localStorage.setItem(LSOrderKey, JSON.stringify(temp_order));
  }

  const showPictureModal = (product) => {
    setProductShown(product)
    setModal(true)
  }

  const handleItemAdded = (product) => {
    const value = parseFloat(parseFloat(product.price/100).toFixed(2));

    setPrice(price+value)
    setAmount(amount+1)

    if(basket[product.id]) {
      const old_value = basket[product.id]
      const new_basket = {...basket, [product.id]: old_value+1}
      setBasket(new_basket)
      saveOrder(new_basket)

    } else {
      const new_basket = {...basket, [product.id]: 1}
      setBasket(new_basket)
      saveOrder(new_basket)
    }
  }

  const handleItemRemoved = (product) => {
    const value = parseFloat(parseFloat(product.price/100).toFixed(2));
    if (amount !== 0) setPrice(price-value)
    if (amount !== 0) setAmount(amount-1)
    if(basket[product.id]) {
      const old_value = basket[product.id]
      const new_basket = {...basket, [product.id]: old_value-1}
      Object.keys(new_basket).forEach(key => {
        if (new_basket[key] === 0) delete new_basket[key]
      });
      setBasket(new_basket)
      saveOrder(new_basket)
    }
  }

  if (error) {
    return <Redirect to="/" />
  } else {

    return (
      <div className="app-wrapper">
        {!categories ? 
          <div className="loading-wrapper">
            Loading all the goods
          </div>
          :
          <div>
            {modal ? (
              <PictureModal 
                product={productShown}
                onClose={() => {setModal(false)}}>
      
              </PictureModal>
            )
            : (fromTop.y > 170 || Object.entries(basket).length !== 0) && (<div className="total-container">
            <div className="total-line">
              <div className="total-word">Total:</div>
              <div className="total-amount">{amount === 0 ? null : amount === 1 ? `${amount} item` : `${amount} items` }</div>
              <div className="total-price h-text-right">£{price.toFixed(2)}</div>
            </div>
      
            <Link 
              to={amount !== 0 ? `${slug}/order` : ""} 
              className="continue-btn h-button h-pointer h-rounded"
              onClick={(e) => {
                if (amount === 0) {
                  e.preventDefault()
                  alert("You have not selected any products.")
                } 
              }}>
              Continue
            </Link>
          </div> )}
         
            <div className="container">
              
              <div className="block intro-block">
                <div className="business-header h-margin-bottom ">
                  <UnderlineText className='business-name__wrapper'>
                    <h1 className="business-name h-700">{user.name}</h1>
                  </UnderlineText>
                  <div className="logo-wrapper">
                    <img className="logo h-circle" src={STATIC + user.image} ref={logoRef}/>
                  </div>
                </div>
                <UnderlineText className='business-subheading__wrapper h-margin-bottom'>
                  <h2 className="business-subheading h-700">{user.subheading}</h2>
                </UnderlineText>
      
                <div className="company-desc h-rounded">
                  {user.business_description}
                </div>
      
                <div className="collection-times">
                  {user.takeout_description}
                </div>
                <div className="collection-location">
                  You can find us <a href="#" className='h-700'><span>here!</span></a>
                </div>
                <div 
                  className="intro-button h-button h-rounded h-uppercase h-text-center h-pointer"
                  onClick={()=>scroll(productRef)}
                  >
                  {user.shop_button}
                </div>
              </div>
              <div ref={productRef} className="h-divider"></div>
              <div className="block block__products">
                {/* <UnderlineText className='block-heading__wrapper h-margin-bottom'> */}
                  <h3 className="block-heading h-700 h-margin-bottom">Menu</h3>
                {/* </UnderlineText> */}

                {categories.map((category, i) => {
                  return (
                    <CategoryWrapper
                      key={`category-wrapper-${category.id}`}
                      category={category}
                      basket={basket}
                      showPictureModal={(pic) => showPictureModal(pic)}
                      handleItemAdded={(prod) => handleItemAdded(prod)}
                      handleItemRemoved={(prod) => handleItemRemoved(prod)}
                    />
                  )
                })}
      
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default Home