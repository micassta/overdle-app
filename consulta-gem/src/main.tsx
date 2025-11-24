import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Ponemos la App dentro de los BrowserRouter y esto hace que funcione la magia (no se como)*/}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
