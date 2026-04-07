import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { ROUTES } from '@/shared/constants/routes'

const AuthPage = lazy(() => import('@/pages/auth-page/ui/auth-page').then((module) => ({ default: module.AuthPage })))
const HomePage = lazy(() => import('@/pages/home-page/ui/home-page').then((module) => ({ default: module.HomePage })))

function PageFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-copa-bg text-copa-text-muted">
      Carregando...
    </div>
  )
}

export function AppRouter() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path={ROUTES.root} element={<Navigate to={ROUTES.auth} replace />} />
        <Route path={ROUTES.auth} element={<AuthPage />} />
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route path="*" element={<Navigate to={ROUTES.auth} replace />} />
      </Routes>
    </Suspense>
  )
}
