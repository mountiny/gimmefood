import React from 'react'
import { Redirect, Link, useHistory } from "react-router-dom"

// Hooks

// Components
import AdminMenu from '../components/AdminMenu.jsx'

const Settings = ({user, changeUser}) => {

  const history = useHistory()

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
            <Link className="h-button h-full-btn h-rounded" to="/admin/settings/edit">Edit profile</Link>
            <button className="h-button h-full-btn h-rounded" onClick={handleLogout}>Log out</button>
        </div>
          
   
      </div>
    )
  }
}

export default Settings