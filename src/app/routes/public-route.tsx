import { Navigate, Outlet } from 'react-router-dom'

import { useCurrentUserQuery } from '@/entities/user/use-current-user-query'
import { ROUTES } from '@/shared/constants/routes'

function GuardFallback() {
  return <div className="flex min-h-dvh items-center justify-center">Carregando...</div>
}

export function PublicRoute() {
  const { data: user, isPending, isError } = useCurrentUserQuery()

  if (isPending) {
    return <GuardFallback />
  }

  if (!isError && user) {
    return <Navigate to={ROUTES.home} replace />
  }

  return <Outlet />
}