import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { PrivateRoute } from '@/app/routes/private-route'
import { PublicRoute } from '@/app/routes/public-route'
import { ROUTES } from '@/shared/constants/routes'

const AuthPage = lazy(() => import('@/pages/auth').then((module) => ({ default: module.AuthPage })))
const HomePage = lazy(() => import('@/pages/home').then((module) => ({ default: module.HomePage })))
const GuessesPage = lazy(() => import('@/pages/guesses').then((module) => ({ default: module.GuessesPage })))

function PageFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      Carregando...
    </div>
  )
}

export function AppRouter() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path={ROUTES.auth} element={<AuthPage />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path={ROUTES.home} element={<HomePage />} />
          <Route path={ROUTES.guesses} element={<GuessesPage />} />
        </Route>

        <Route path={ROUTES.root} element={<Navigate to={ROUTES.home} replace />} />
        <Route path="*" element={<Navigate to={ROUTES.root} replace />} />
      </Routes>
    </Suspense>
  )
}
