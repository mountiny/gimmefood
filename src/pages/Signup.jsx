import React, { useState, useEffect, useRef } from 'react'
import '../assets/styles/main.scss'
import { Redirect, Link, useHistory } from "react-router-dom"

// Services
import usersService from '../services/users'
import validURL from '../services/urlValidator'

// Hooks
import useField from '../hooks/fieldHook'

// Components
import SignupForm from '../components/SignupForm.jsx'


const Signup = ({user}) => {
  const username = useField('text')
  const password = useField('password')
  const name = useField('text')
  const slug = useField('text')
  const email = useField('email')
  const [errorMessage, setErrorMessage] = useState(null)

  const history = useHistory()

  const handleSignup = async (event) => {
    event.preventDefault()

    const isValidURL = validURL(slug.value)
    if (!isValidURL) {
      alert('The URL is not valid. Do not use special characters or spaces.')
      return
    }

    try {
      const new_user = {
        username: username.value, 
        password: password.value, 
        name: name.value, 
        slug: slug.value,
        business_description: '',
        takeout_description: '',
        email: email.value
      }

      const response = await usersService.create(new_user)
      console.log(response)

      username.value = ''
      password.value = ''
      name.value = ''
      slug.value = ''
      email.value = ''
      history.push('/login')

    } catch (exception) {
     
      const error_message = exception.response.data.error
      if (error_message === 'This email is already used.') {
        alert(error_message)
      } else if (error_message === 'This username is already used.') {
        alert(error_message)
      } else if (error_message === 'This URL name is already used.') {
        alert(error_message)
      } else {
        console.log('exception: ', exception)
      }
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
          <Link to="/login" className="main-page__link h-pointer back-link h-rounded">
            Log In
          </Link>
        </div>
        <div className="container signup-wrapper">
         
          {errorMessage ? <div className="error-message">{errorMessage}</div> : null}
          <SignupForm
              username={username.value}
              password={password.value}
              name={name.value}
              url_name={slug.value}
              email={email.value}
              handleUsernameChange={(e) => username.onChange(e)}
              handlePasswordChange={(e) => password.onChange(e)}
              handleNameChange={(e) => name.onChange(e)}
              handleURLNameChange={(e) => slug.onChange(e)}
              handleEmailChange={(e) => email.onChange(e)}
              handleSubmit={handleSignup}
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

export default Signup