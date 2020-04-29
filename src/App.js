import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import './assets/styles/main.scss'
import { IMAGES } from './config'
import productService from './services/products'
import categoriesService from './services/categories'
import resetDB from './services/resetDB'
import loginService from './services/login'
import usersService from './services/users'
import db from '../db.json'

import scroll from './services/helpers'

import smoothscroll from 'smoothscroll-polyfill';

// Hooks
import useField from './hooks/fieldHook'
import useOnScreen from './hooks/onScreenHook'

// Components
import Product from './components/Product.jsx'
import PictureModal from './components/PictureModal.jsx'

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

const populateDB = async () => {
  // // console.log(db)
  // // const users = db.users
  // // const products = db.products
  // // const categories = db.categories
  // setDb(db)

  // console.log(users, products, categories)
}


const App = () => {
  const [counter, setCounter] = useState(0)
  const [price, setPrice] = useState(0)
  const [amount, setAmount] = useState(0)
  const [modalPic, setModalPic] = useState("")
  const [basket, setBasket] = useState({})
  const [values, setValues] = useState([])
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [user, setUser] = useState([])
  const [users, setUsers] = useState([])
  const [modal, setModal] = useState(false)
  const [delivery, setDelivery] = useState(false)

  const name = useField("name")
  const phone = useField("phone")
  const email = useField("email")
  const note = useField("note")

  const productRef = useRef(null)
  const payRef = useRef(null)
  // const products = useProducts(BACKEND_URL)

  const orderForm = useOnScreen(payRef, '-200px')

  // Get all products

  useEffect(() => {
    // populateDB()
    console.log("scroll: ", scroll)
    productService
      .getAll()
      .then(products => {
        console.log("Products: ", products)
        setProducts(products)
      })
  }, [handleProductAddition])

  // Get all categories

  useEffect(() => {
    // populateDB()
    categoriesService
      .getAll()
      .then(categories => {
        console.log("Categories: ", categories)
        setCategories(categories)
      })
  }, [handleCategoryAddition])

  useEffect(() => {
    // Get all users
    usersService
      .getAll()
      .then(us => {
        setUsers(us)
      })
  }, [handleUserRegistration])

  // Check if user is logged in

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedGimmeFoodUser')
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
        'loggedGimmeFoodUser', JSON.stringify(user)
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

  const handleUserLogout = () => {
    window.localStorage.removeItem('loggedGimmeFoodUser')
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
    // window.localStorage.removeItem('loggedGimmeFoodUser')
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
    // window.localStorage.removeItem('loggedGimmeFoodUser')
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

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted")
  }

  return (
    <div className="app-wrapper">
      {modal && (
        <PictureModal 
          picture={modalPic}
          onClose={() => showPictureModal()}>

        </PictureModal>
      )}
      {!orderForm && 
        <div className="total-container">
          <div className="total-line">
            <div className="total-word">Total:</div>
            <div className="total-amount">{amount === 0 ? null : amount === 1 ? `${amount} item` : `${amount} items` }</div>
            <div className="total-price h-text-right">£{price.toFixed(2)}</div>
          </div>
          <div className="continue-btn h-button h-pointer h-rounded" onClick={()=>scroll(payRef)}>Continue</div>
        </div> 
      }
      

      <div className="container">
        
        <div className="block">
          <img className="logo h-circle" src={IMAGES + 'logo.jpg'} />
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
        <div ref={productRef} className="block">
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

        <div className="block pay-block" ref={payRef}>
          <h3 className="block-heading h-700">Sent Order</h3>
          <div onClick={() => setDelivery(!delivery)} className={delivery ? "collection-way h-pointer h-rounded" : "collection-way h-selected h-pointer h-rounded"}>
            <h4>Colect it!</h4><br />
            On Friday at our bakery in Whiteinch<br />
            <a href="https://www.google.com/maps/place/Kaf+Bakery/@55.8726385,-4.3385814,17.99z/data=!4m5!3m4!1s0x488845202c15cfc7:0xfa84b991fb493ce9!8m2!3d55.8726425!4d-4.3392626" target="_blank">Click here for location of the bakery!</a>
          </div>
          <div onClick={() => setDelivery(!delivery)} className={delivery ? "collection-way h-selected h-pointer h-rounded" : "collection-way h-pointer h-rounded"}>
            <h4>Deliver it to me!</h4><br />
            Give us your address and we will deliver your order on Friday evening
          </div>
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
            <button className="order-btn h-button h-rounded h-pointer" type="submit">Order</button>
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

export default App