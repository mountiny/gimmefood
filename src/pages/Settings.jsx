import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import '../assets/styles/main.scss'
import { IMAGES } from '../config'
import productService from '../services/products'
import categoriesService from '../services/categories'
import resetDB from '../services/resetDB'
import loginService from '../services/login'
import usersService from '../services/users'
import db from '../../db.json'
import { Redirect, Link, useHistory } from "react-router-dom"

// Hooks


// Components
import AdminMenu from '../components/AdminMenu.jsx'


const Settings = ({user, changeUser}) => {

  const [counter, setCounter] = useState(0)
  const [price, setPrice] = useState(0)
  const [amount, setAmount] = useState(0)
  const [modalPic, setModalPic] = useState("")
  const [basket, setBasket] = useState({})
  const [values, setValues] = useState([])
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [modal, setModal] = useState(false)

  const history = useHistory()


  // Get all products

  // useEffect(() => {
  //   // populateDB()
  //   // console.log("scroll: ", scroll)
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

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted")
  }

  const filterList = (t) => {
    setOrderFilter(t)

  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBonTakeoutUser')
    changeUser(null)
    history.push("/login")
    
  }
  if (user === null) {
    return <Redirect to="/login" />
  } else {
    return (
      <div className="app-wrapper">

        <AdminMenu />
  
        <div className="container container-admin container__settings">
            <h2 className="page-heading h-700">Settings</h2>
            <button className="h-button h-full-btn h-rounded" onClick={handleLogout}>Log out</button>
        </div>
          
   
      </div>
    )
  }
}

export default Settings