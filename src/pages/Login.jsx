import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import '../assets/styles/main.scss'
import { IMAGES } from '../config'
import db from '../../db.json'
import { Redirect, Link, useHistory } from "react-router-dom"

// Services
import userContext from '../services/userContext';
import productService from '../services/products'
import categoriesService from '../services/categories'
import resetDB from '../services/resetDB'
import loginService from '../services/login'
import usersService from '../services/users'

// Hooks
import useField from '../hooks/fieldHook'

// Components
import LoginForm from '../components/LoginForm.jsx'


const Login = ({user, changeUser}) => {
  const username = useField('text')
  const password = useField('password')
  // const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const history = useHistory()
  
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

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const logged_user = await loginService.login({
        username: username.value, password: password.value,
      })
      console.log('login logged_user:', logged_user)

      window.localStorage.setItem(
        'loggedBonTakeoutUser', JSON.stringify(logged_user)
      )
      // noteService.setToken(user.token)
      username.value = ''
      password.value = ''
      changeUser(logged_user)
      history.push('/admin')

    } catch (exception) {
      console.log(exception)
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  if (user) {
    return <Redirect to="/admin" />
  } else {
    return (
      <div className="app-wrapper">
        <div className="container top-menu__container">
          <Link to="/" className="main-page__link h-pointer back-link h-rounded">
            Back to main page
          </Link>
          <Link to="/signup" className="main-page__link h-pointer back-link h-rounded">
            Sign up
          </Link>
        </div>
        <div className="container login-wrapper">
         
          {errorMessage ? <div className="error-message">{errorMessage}</div> : null}
          <LoginForm
              username={username.value}
              password={password.value}
              handleUsernameChange={(e) => username.onChange(e)}
              handlePasswordChange={(e) => password.onChange(e)}
              handleSubmit={handleLogin}
            />
        </div>
        <div className="block footer">
          <div>
            Created by <a href="https://www.mountiny.com" target="_blank">Mountiny - Vit Horacek</a>
          </div>
        </div>
      </div>
    )
  }
  
}

export default Login