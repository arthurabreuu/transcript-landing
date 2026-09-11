import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Sucesso from './pages/Sucesso.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Sucesso />
  </StrictMode>,
)
