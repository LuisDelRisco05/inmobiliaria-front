import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { RepositoryProvider } from './ui/providers/RepositoryProvider.tsx'
import { AlertProvider } from './ui/context/alert/AlertProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RepositoryProvider>
      <AlertProvider>
        <App />
      </AlertProvider>
    </RepositoryProvider>
  </StrictMode>,
)
