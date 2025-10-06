// frontend/src/main.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <-- Import this
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './services/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>  {/* <-- Wrap your App component */}
      <AuthProvider> {/* <-- Wrap App */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
