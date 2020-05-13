import React, { useState, useEffect } from 'react'
import '../assets/styles/main.scss'
import { Redirect, Link, useHistory } from "react-router-dom"

// Services
import productService from '../services/products'
import categoriesService from '../services/categories'
import loginService from '../services/login'
import usersService from '../services/users'

// Hooks
import useField from '../hooks/fieldHook'

// Components
import LoginForm from '../components/LoginForm.jsx'


const Login = ({user, changeUser}) => {
  const username = useField('text')
  const password = useField('password')
  const [errorMessage, setErrorMessage] = useState(null)

  const history = useHistory()

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
      servicesSetToken(logged_user.token)
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

  const servicesSetToken = (token) => {
    productService.setToken(token)
    usersService.setToken(token)
    categoriesService.setToken(token)
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