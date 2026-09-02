import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
  const querclient=new QueryClient;

createRoot(document.getElementById('root')!).render(
  
  <StrictMode>
    <QueryClientProvider client={querclient}>
    <BrowserRouter> 
       <Toaster position="top-right" />
     <App />
    </BrowserRouter>
  </QueryClientProvider>
  </StrictMode>,
)
