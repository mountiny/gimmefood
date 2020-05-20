import React, { useState, useEffect } from 'react'
import { Redirect, Link, useHistory } from "react-router-dom"

// Hooks

// Components
import AdminMenu from '../components/AdminMenu.jsx'

// Services
import usersService from '../services/users'

const Settings = ({user, changeUser}) => {

  const [stripeId, setStripeId] = useState('')

  const history = useHistory()



  useEffect(() => {
    getStripeId()

  }, [])

  const getStripeId = async () => {
    try {
      const response = await usersService.getStripeId(user.token)
      setStripeId(response)
    } catch (e) {
      console.log("Getitng stripe id error: ", e)
    }
      
  }
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBonTakeoutUser')
    changeUser(null)
    history.push("/login")
  }
  const disconnectStripe = async () => {
    const response = await usersService.disconnectStripe(user.token)

    if (response.status === 200) {
      setStripeId('')
      alert('Access to your Stripe account has been successfully revoked!')
    } else {
      console.log('Something went wrong: ', response)
    }
  }

  if (user === null) {
    return <Redirect to="/login" />
  } else {
    return (
      <div className="app-wrapper">

        <AdminMenu />
  
        <div className="container container-admin container__settings">
          <div className='admin-heading__wrapper h-offset-wrapper h-offset-bg'>
            <h2 className="page-heading h-700">Settings</h2>
          </div>
          <div className="settings-menu">
            <div className="settings-menu__top">
              <Link className="h-button h-full-btn h-rounded" to="/admin/settings/edit">Edit profile</Link>
              {
                (stripeId === '') 
                ?  
                <>
                <div className="settings-description">
                  In order to accept payments, you have to create Stripe account which is the authority handling the payments:
                </div>
                <a 
                  href={`https://connect.stripe.com/oauth/authorize?client_id=${STRIPE_CLIENT_ID}&state=${user.sekred}&scope=read_write&response_type=code&stripe_user[email]=${user.email}`}
                  className='h-button h-full-btn h-rounded'
                  >
                  Connect with Stripe
                </a>
                </>
                :
                <div
                className='h-button h-full-btn h-rounded h-pointer'
                onClick={() => disconnectStripe()}
                >
                  Deactivate Stripe
                </div>
              }
             
              <button className="h-button h-full-btn h-rounded" onClick={handleLogout}>Log out</button>
            </div>
            <div className="settings-menu__bottom">
            </div>
          </div>
        </div>
          
   
      </div>
    )
  }
}

export default Settings