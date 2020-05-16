import React from 'react'
import { Link } from "react-router-dom"
import { IMAGES } from '../config'

// Icons
import OrdersIcon from './icons/OrdersIcon.jsx';
import MenuIcon from './icons/MenuIcon.jsx';
import SettingsIcon from './icons/SettingsIcon.jsx';

const AdminMenu = () => {

  return (
    <div className="admin-controls">
      <div className="admin-inner">
        <Link to="/admin/" className="admin-btn h-pointer">
          <OrdersIcon />
          <div>
            Orders
          </div>
        </Link>
        <Link to="/admin/menu/" className="admin-btn h-pointer">
          <MenuIcon />
          <div>
            Menu
          </div>
        </Link>
        <Link to="/admin/settings/" className="admin-btn h-pointer">
          <SettingsIcon />
          <div>
            Settings
          </div>
        </Link>
      </div>
    </div>
  )
}

export default AdminMenu