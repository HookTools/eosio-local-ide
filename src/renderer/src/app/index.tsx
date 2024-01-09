import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from '../App'
import './index.css'

ReactDOM.createRoot(document.querySelector('#root') as HTMLElement).render(
  <HashRouter>
    <App />
  </HashRouter>,
)
