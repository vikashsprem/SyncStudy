import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Icon
import '@fortawesome/fontawesome-free/css/all.css';

// Import polyfills
import setupPolyfills from './polyfills.js';

// Initialize polyfills
setupPolyfills();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
