import React, { useState, useEffect } from 'react'
import usersService from '../services/users'
import { Redirect, useHistory } from "react-router-dom"

// Components
import AdminMenu from '../components/AdminMenu.jsx'
import EditProfileForm from '../components/EditProfileForm.jsx'


const EditProfile = ({user, changeUser}) => {

  const [userInfo, setUserInfo] = useState(null)

  const history = useHistory()

  useEffect(() => {
    getUserInfo()
  }, [])

  const getUserInfo = async () => {
    try {
      const response = await usersService.getInfo(user.token)
      setUserInfo(response)
    } catch (e) {
      console.log('Error: ', e)
    }
  }

  const saveEditedUser = async (data) => {

    try {
      const response = await usersService.update(data)
      alert('Your data has been save successfully!')
      history.push('/admin/settings')
    } catch (e) {
      console.log('Editing user error: ', e)
    }

  }
  if (user === null) {
    return <Redirect to="/login" />
  } else {
    return (
      <div className="app-wrapper">

        <AdminMenu />
  
        <div className="container container-admin container__settings">
          <div className="h-pointer back-link h-rounded"
            onClick={()=> history.goBack()}>
            Go back
          </div>
          <h2 className="page-heading h-700">Edit profile</h2>
          <EditProfileForm 
            userInfo={userInfo}
            handleUserEdit={(data) => saveEditedUser(data)}
          />
        </div>
          
   
      </div>
    )
  }
}

export default EditProfile