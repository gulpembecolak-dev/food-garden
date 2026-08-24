import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { UserProvider } from './context/UserContext.jsx'
import { MealsProvider } from './context/MealsContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <UserProvider>
        <MealsProvider>
          <App />
        </MealsProvider>
      </UserProvider>
    </HashRouter>
  </React.StrictMode>,
)
