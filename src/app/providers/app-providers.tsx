import { BrowserRouter } from 'react-router-dom'
import { type PropsWithChildren } from 'react'

import { QueryClientAppProvider } from '@/app/providers/query-client-provider'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientAppProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientAppProvider>
  )
}
