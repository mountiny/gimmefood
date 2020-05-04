import React from 'react'
import { Redirect, Link } from "react-router-dom"
import { IMAGES } from '../config'

const AdminMenu = () => {

  return (
    <div className="admin-controls">
      <div className="admin-inner">
        <Link to="/admin/" className="admin-btn h-pointer">
          <img src={IMAGES + 'icons/orders_menu.svg'} alt="Orders"/>
          <div>
            Orders
          </div>
        </Link>
        <Link to="/admin/menu/" className="admin-btn h-pointer">
          <img src={IMAGES + 'icons/menu_menu.svg'} alt="Menu"/>
          <div>
            Menu
          </div>
        </Link>
        <Link to="/admin/settings/" className="admin-btn h-pointer">
          <img src={IMAGES + 'icons/settings_menu.svg'} alt="Settings"/>
          <div>
            Settings
          </div>
        </Link>
      </div>
    </div>
  )
}

export default AdminMenu