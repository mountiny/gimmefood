import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import PromisePolyfill from 'promise-polyfill'
import {
  BrowserRouter as Router
} from "react-router-dom"



async function loadPolyfills() {
  if (typeof window.IntersectionObserver === 'undefined') {
    await import('intersection-observer')
  }
}

loadPolyfills()

if (!window.Promise) {
  window.Promise = PromisePolyfill
}

const loggedUserJSON = window.localStorage.getItem('loggedBonTakeoutUser')
let user = null
if (loggedUserJSON) {
  user = JSON.parse(loggedUserJSON)
}



ReactDOM.render(
  <Router>
      <App LSUser={user}/>
  </Router>, 
  document.getElementById('root'))