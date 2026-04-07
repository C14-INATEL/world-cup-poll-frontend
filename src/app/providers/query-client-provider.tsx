import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type PropsWithChildren } from 'react'

const query_client = new QueryClient()

export function QueryClientAppProvider({ children }: PropsWithChildren) {
  return <QueryClientProvider client={query_client}>{children}</QueryClientProvider>
}
