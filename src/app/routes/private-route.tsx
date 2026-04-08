import { AuthenticatedLayout } from '@/app/layouts/authenticated-layout'
import { Navigate, Outlet } from 'react-router-dom'

import { useCurrentUserQuery } from '@/entities/user/use-current-user-query'
import { ROUTES } from '@/shared/constants/routes'

function GuardFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      Carregando...
    </div>
  )
}

export function PrivateRoute() {
  const { data: user, isPending, isError } = useCurrentUserQuery()

  if (isPending) {
    return <GuardFallback />
  }

  if (isError || !user) {
    return <Navigate to={ROUTES.auth} replace />
  }

  return (
    <AuthenticatedLayout>
      <Outlet />
    </AuthenticatedLayout>
  )
}
