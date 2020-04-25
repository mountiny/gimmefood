import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './assets/styles/main.scss'
import { IMAGES } from './config'
import productService from './services/products'
import categoriesService from './services/categories'
import resetDB from './services/resetDB'
import loginService from './services/login'
import usersService from './services/users'
import db from '../db.json'

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
  const [values, setValues] = useState([])
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [user, setUser] = useState([])
  const [users, setUsers] = useState([])
  // const products = useProducts(BACKEND_URL)

  // Get all products

  useEffect(() => {
    // populateDB()
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

  return (
    <div className="container">
      <img className="logo" src={IMAGES + 'logo_ant.png'} />

      <div>There is {categories.length} categories.</div>
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
      <button onClick={handleDatabaseReset}>Reset database</button>
    </div>
  )
}

export default App