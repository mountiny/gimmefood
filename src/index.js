import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import PromisePolyfill from 'promise-polyfill'

async function loadPolyfills() {
  if (typeof window.IntersectionObserver === 'undefined') {
    await import('intersection-observer')
  }
}

loadPolyfills()

if (!window.Promise) {
  window.Promise = PromisePolyfill
}

ReactDOM.render(<App />, document.getElementById('root'))