import { Navigate, Outlet } from 'react-router-dom'

import { useCurrentUserQuery } from '@/entities/user/use-current-user-query'
import { ROUTES } from '@/shared/constants/routes'

function GuardFallback() {
  return <div className="flex min-h-svh items-center justify-center text-copa-text-muted">Carregando...</div>
}

export function PrivateRoute() {
  const { data: user, isPending, isFetching, isError } = useCurrentUserQuery()

  if (isPending || isFetching) {
    return <GuardFallback />
  }

  if (isError || !user) {
    return <Navigate to={ROUTES.auth} replace />
  }

  return <Outlet />
}