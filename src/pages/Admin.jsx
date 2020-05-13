import React, { useState, useEffect } from 'react'
import '../assets/styles/main.scss'
import { Redirect } from "react-router-dom"

// Hooks

// Components
import Order from '../components/Order.jsx'
import AdminMenu from '../components/AdminMenu.jsx'

const Admin = ({user}) => {

  const [orderFilter, setOrderFilter] = useState(0)

  // Get all products
  const filterList = (t) => {
    setOrderFilter(t)

  }

  if (user === null) {
    return <Redirect to="/login" />
  } else {
    return (
      <div className="app-wrapper">

        <AdminMenu />

        <div className="container container-admin container__orders">
          <h2 className="page-heading h-700">Orders</h2>

          <div className="orders-filtering">
            <div className={orderFilter === 0 ? "orders-filter h-rounded h-pointer selected" : "orders-filter h-rounded h-pointer"}
              onClick={() => {
                filterList(0);
              }}>
              New
            </div>
            <div className={orderFilter === 1 ? "orders-filter h-rounded h-pointer selected" : "orders-filter h-rounded h-pointer"}
              onClick={() => {
                filterList(1);
              }}>
              All
            </div>
            <div className={orderFilter === 2 ? "orders-filter h-rounded h-pointer selected" : "orders-filter h-rounded h-pointer"}
              onClick={() => {
                filterList(2);
              }}>
              Sorted
            </div>
            <div className={orderFilter === 3 ? "orders-filter h-rounded h-pointer selected" : "orders-filter h-rounded h-pointer"}
              onClick={() => {
                filterList(3);
              }}>
              Deliveries
            </div>
          </div>

          <div className="orders-list">
            <Order></Order>
            <Order></Order>
            <Order></Order>
          </div>
          
        </div>
      </div>
    )
  }
}

export default Admin