import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from '@/app/app'
import { AppProviders } from '@/app/providers/app-providers'
import '@/app/styles/global.css'

const root_element = document.getElementById('root')

if (!root_element) {
  throw new Error('Root element not found')
}

createRoot(root_element).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
)
