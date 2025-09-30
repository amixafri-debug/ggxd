import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import impactor from './mockups/Impactor-mockup.jsx'
import orbitas from './mockups/orbitas.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
