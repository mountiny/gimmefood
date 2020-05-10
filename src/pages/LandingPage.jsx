import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { IMAGES, COMPANY } from '../config'
import { Link } from "react-router-dom"
import productService from '../services/products'
import categoriesService from '../services/categories'
import resetDB from '../services/resetDB'
import loginService from '../services/login'
import usersService from '../services/users'
// import db from '../db.json'

import scroll from '../services/helpers'

import smoothscroll from 'smoothscroll-polyfill';

// Hooks
import useField from '../hooks/fieldHook'
import useOnScreen from '../hooks/onScreenHook'

// Components
import Product from '../components/Product.jsx'
import PictureModal from '../components/PictureModal.jsx'

smoothscroll.polyfill();

const LandingPage = () => {
  const [counter, setCounter] = useState(0)
  const [price, setPrice] = useState(0)
  const [amount, setAmount] = useState(0)
  const [modalPic, setModalPic] = useState("")
  const [basket, setBasket] = useState({})
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
  const [categories, setCategories] = useState([])
  const [user, setUser] = useState([])
  const [order, setOrder] = useState({})
  const [modal, setModal] = useState(false)

  const productRef = useRef(null)
  const logoRef = useRef(null)
  // const products = useProducts(BACKEND_URL)

  const logoInView = useOnScreen(logoRef, '0px')
  // const productsInScreen = useOnScreen(productRef, '0px')

  // Get all products


  // useEffect(() => {
  //   // populateDB()
  //   console.log("scroll: ", scroll)
  //   productService
  //     .getAll()
  //     .then(products => {
  //       console.log("Products: ", products)
  //       setProducts(products)
  //     })
  // }, [handleProductAddition])

  // // Get all categories

  // useEffect(() => {
  //   // populateDB()
  //   categoriesService
  //     .getAll()
  //     .then(categories => {
  //       console.log("Categories: ", categories)
  //       setCategories(categories)
  //     })
  // }, [handleCategoryAddition])

  // Check if user is logged in

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBonTakeoutUser')
    getOrder()
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      console.log('User from localStorage ', user)
      setUser(user)
      servicesSetToken(user.token)
    }
  }, [])

  const servicesSetToken = (token) => {
    console.log('Services token: ', token)
    productService.setToken(token)
    usersService.setToken(token)
    categoriesService.setToken(token)
  }
  
  const handleClick = () => {
    setCounter(counter + 1)
    setValues(values.concat(counter))
  }

  const handleDatabaseReset = () => {
    if (window.confirm("Yes")) {
      resetDB.reset().then(response => {
        console.log(response)
      })
    }
  }

  const handleUserRegistration = () => {
    const new_user = db.users[0]
    usersService.create(new_user).then(response => {
      console.log(response)
    }).catch( e => {
      console.log(e)
    })
   
  }

  const handleUserLogin = async (event) => {
    event.preventDefault()
    try {
      // const user = await loginService.login({
      //   username: username.value, password: password.value,
      // })

      const user = await loginService.login({
        username: db.users[0].username, password: db.users[0].password,
      })
      console.log(user)

      window.localStorage.setItem(
        'loggedBonTakeoutUser', JSON.stringify(user)
      )
      servicesSetToken(user.token)
      setUser(user)
      // username.value = ''
      // password.value = ''
    } catch (exception) {
      alert('Wrong credentials')
      // setTimeout(() => {
      //   setErrorMessage(null)
      // }, 5000)
    }
  }
  const handleCategoryAddition = () => {
    const new_category = db.categories[0]
    console.log("Category about add: ", new_category)
    categoriesService.create(new_category).then(response => {
      console.log(response)
      setCategories(categories.concat(response))
    }).catch( e => {
      console.log(e)
    })
  }

  const handleProductAddition = () => {
    const new_product = db.products[0]
    console.log("Product about add: ", new_product)
    productService.create(new_product).then(response => {
      console.log(response)
      setProducts(products.concat(response))
    }).catch( e => {
      console.log(e)
    })
  }

  const showPictureModal = (picture) => {
    setModalPic(picture)
    setModal(!modal)

  }

  const handleItemAdded = (prod_price, id) => {
    const value = parseFloat(prod_price);

    console.log('id of the item: ', id)

    setPrice(price+value)
    setAmount(amount+1)
    if(basket[id]) {
      const old_value = basket[id]
      const new_basket = {...basket, [id]: old_value+1}
      setBasket(new_basket)

    } else {
      const new_basket = {...basket, [id]: 1}
      setBasket(new_basket)
    }
    console.log("Product added to basket: ", basket)
  }

  const handleItemRemoved = (prod_price, id) => {
    const value = parseFloat(prod_price);
    if (amount !== 0) setPrice(price-value)
    if (amount !== 0) setAmount(amount-1)
    if(basket[id]) {
      const old_value = basket[id]
      const new_basket = {...basket, [id]: old_value-1}
      setBasket(new_basket)

    }
  }
  const getOrder = () => {
    const LSKey = `${COMPANY}-order`
    const new_order = JSON.parse(window.localStorage.getItem(LSKey))
    if (new_order) {
      setOrder(order)
    }
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted")
  }

  const saveOrder = () => {
    const LSKey = `${COMPANY}-order`
    const order = {"order": []}
    window.localStorage.setItem(LSKey, JSON.stringify(order));
  }

  return (
    <div className="app-wrapper">
      {modal ? (
        <PictureModal 
          picture={modalPic}
          product={productShown}
          onClose={() => {showPictureModal()}}>

        </PictureModal>
      ): !logoInView && (<div className="total-container">
      <div className="total-line">
        <div className="total-word">Total:</div>
        <div className="total-amount">{amount === 0 ? null : amount === 1 ? `${amount} item` : `${amount} items` }</div>
        <div className="total-price h-text-right">£{price.toFixed(2)}</div>
      </div>

      <Link 
        to={amount !== 0 ? "/order": ""} 
        className="continue-btn h-button h-pointer h-rounded"
        onClick={() => {
          if (amount === 0) alert("You have not selected any products.")
        }}>
        Continue
      </Link>
      {/* <div className="continue-btn h-button h-pointer h-rounded" onClick={()=>scroll(payRef)}>Continue</div> */}
    </div> )}
      {/* {!logoInView && !modal &&
        <div className="total-container">
          <div className="total-line">
            <div className="total-word">Total:</div>
            <div className="total-amount">{amount === 0 ? null : amount === 1 ? `${amount} item` : `${amount} items` }</div>
            <div className="total-price h-text-right">£{price.toFixed(2)}</div>
          </div>

          <Link 
            to={amount !== 0 ? "/order": ""} 
            className="continue-btn h-button h-pointer h-rounded"
            onClick={() => {
              if (amount === 0) alert("You have not selected any products.")
            }}>
            Continue
          </Link>

        </div> 
      } */}
      

      <div className="container">
        
        <div className="block">
          <div className="logo-wrapper">
            <img className="logo h-circle" src={IMAGES + 'logo.jpg'} ref={logoRef}/>
          </div>
          <h1 className="h-text-center h-margin-bottom h-700">Kaf Bakery</h1>

          <h2 className="h-text-center h-margin-bottom h-700 h-uppercase">take away</h2>

          <div className="company-desc h-text-center h-rounded">
            We are crafty bakery from West End providing you with delicious breads, focaccias, brownies and many more since 2018.
          </div>

          <h3 className="collection-times h-text-center">Orders made today will be ready to pick up on Friday at our bakery in Whiteinch! Please, come on Friday, we bake it fresh.</h3>
          <div 
            className="intro-button h-button h-rounded h-uppercase h-text-center h-pointer"
            onClick={()=>scroll(productRef)}
            >
            Give me some sugar!
          </div>
        </div>
        <div className="h-divider"></div>
        <div ref={productRef} className="block block__products">
          <h3 className="block-heading h-700">Our products</h3>

          <div className="category-wrapper">
            <h4 className="category-heading">Breads</h4>
            <div className="products-container">

              <Product 
                name="Sourdough Bread" 
                price="3.00" 
                picture="logo.jpg" 
                description="This is a description of this lovely and crunchy bread."
                onPictureClick={(pic) => showPictureModal(pic)}
                onItemAdded={(price, id) => handleItemAdded(price, id)}
                onItemRemoved={(price, id) => handleItemRemoved(price,id)}>
              </Product>
              <Product 
                name="Corn Bread" 
                price="2.49" 
                picture="logo.jpg" 
                description="Cornbread is underrated. Try ours."
                onPictureClick={(pic) => showPictureModal(pic)}
                onItemAdded={(price, id) => handleItemAdded(price, id)}
                onItemRemoved={(price, id) => handleItemRemoved(price,id)}>
              </Product>
              <Product 
                name="Rye Bread" 
                price="2.29" 
                picture="logo.jpg" 
                description="Fiber fueled heatlhy bread."
                onPictureClick={(pic) => showPictureModal(pic)}
                onItemAdded={(price, id) => handleItemAdded(price, id)}
                onItemRemoved={(price, id) => handleItemRemoved(price,id)}>
              </Product>

            </div>
          </div>

          <div className="category-wrapper">
            <h4 className="category-heading">Coffees</h4>
            <div className="products-container">

              <Product 
                name="Karinga AA - Kenya" 
                price="9.50" 
                picture="coffee.png" 
                description="Washed. A succulent, juicy Kenyan coffee bold both in bean size and flavour.  This AA selection is full of blackcurrant and citrus fruit flavours on a dense molasses syrup like finish."
                onPictureClick={(pic) => showPictureModal(pic)}
                onItemAdded={(price, id) => handleItemAdded(price, id)}
                onItemRemoved={(price, id) => handleItemRemoved(price,id)}>
              </Product>
              <Product 
                name="La Virgen - Columbia" 
                price="8.00" 
                picture="coffee.png" 
                description="Washed. Sweet, succulent and equally delicious on many a different coffee brewer.  Creamy butterscotch like flavours lead onto orange citrus, stewed apple and roasted almond like flavours."
                onPictureClick={(pic) => showPictureModal(pic)}
                onItemAdded={(price, id) => handleItemAdded(price, id)}
                onItemRemoved={(price, id) => handleItemRemoved(price,id)}>
              </Product>
              <Product 
                name="San Augustin - Guatemala" 
                price="8.50" 
                picture="coffee.png" 
                description="Washed. Indulgent and rich in flavour, this is our darkest single origin roast.  Flavours of dusted cocoa, molasses and roasted almonds are supported by a dense, creamy mouthfeel."
                onPictureClick={(pic) => showPictureModal(pic)}
                onItemAdded={(price, id) => handleItemAdded(price, id)}
                onItemRemoved={(price, id) => handleItemRemoved(price,id)}>
              </Product>

            </div>
          </div>

        </div>


        {/* <div>There is {categories.length} categories.</div>
        <button onClick={handleCategoryAddition}>Add Categories</button>
        <div>There is {products.length} products.</div>
        <button onClick={handleProductAddition}>Add products</button>
        <br />
        <button onClick={handleUserRegistration}>Create user</button>
        <div>There is {users.length} users registered.</div>
        <button onClick={handleUserLogin}>Login</button>
        {user === null ?
            <div><h4>Noone is logged in</h4></div> :
            <div>
              {user.name}
              <button onClick={handleUserLogout}>Log out</button>
            </div>
          }
        <br />
        <button onClick={handleDatabaseReset}>Reset database</button> */}
      </div>
    </div>
  )
}

export default LandingPage