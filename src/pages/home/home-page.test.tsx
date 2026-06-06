import { describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { http, HttpResponse } from 'msw'

import { apiBaseUrl } from '@/shared/api/api'
import { ENDPOINTS } from '@/shared/constants/endpoints'
import { ROUTES } from '@/shared/constants/routes'
import { server } from '@/test/mocks/server'
import { renderWithProviders } from '@/test/setup/render-with-providers'
import { mockUser, mockPoll } from '@/test/fixtures'
import { HomePage } from '@/pages/home'

function renderHomePage() {
  return renderWithProviders(
    <Routes>
      <Route path={ROUTES.home} element={<HomePage />} />
    </Routes>,
    { initialEntries: [ROUTES.home] },
  )
}

describe('HomePage', () => {
  beforeEach(() => {
    localStorage.setItem('auth_token', 'test-token')
  })

  it('renderiza o cabeçalho principal', async () => {
    server.use(
      http.get(apiBaseUrl + ENDPOINTS.auth.me, () => HttpResponse.json(mockUser)),
      http.get(apiBaseUrl + ENDPOINTS.poll.user, () => HttpResponse.json([])),
    )

    renderHomePage()

    await waitFor(() => {
      expect(screen.getByText('Painel principal')).toBeInTheDocument()
    })
  })

  it('exibe estado vazio quando usuário não tem bolões', async () => {
    server.use(
      http.get(apiBaseUrl + ENDPOINTS.auth.me, () => HttpResponse.json(mockUser)),
      http.get(apiBaseUrl + ENDPOINTS.poll.user, () => HttpResponse.json([])),
    )

    renderHomePage()

    await waitFor(() => {
      expect(screen.getByText(/ainda não participa de nenhum grupo/i)).toBeInTheDocument()
    })
  })

  it('exibe os bolões do usuário', async () => {
    server.use(
      http.get(apiBaseUrl + ENDPOINTS.auth.me, () => HttpResponse.json(mockUser)),
      http.get(apiBaseUrl + ENDPOINTS.poll.user, () => HttpResponse.json([mockPoll])),
    )

    renderHomePage()

    await waitFor(() => {
      expect(screen.getByText(mockPoll.title)).toBeInTheDocument()
    })
  })

  it('abre modal de criar bolão ao clicar em Novo', async () => {
    const user = userEvent.setup()

    server.use(
      http.get(apiBaseUrl + ENDPOINTS.auth.me, () => HttpResponse.json(mockUser)),
      http.get(apiBaseUrl + ENDPOINTS.poll.user, () => HttpResponse.json([mockPoll])),
    )

    renderHomePage()

    await waitFor(() => screen.getByRole('button', { name: /novo/i }))
    await user.click(screen.getByRole('button', { name: /novo/i }))

    expect(screen.getByText('Criar grupo')).toBeInTheDocument()
  })

  it('abre modal de entrar em bolão ao clicar em Entrar', async () => {
    const user = userEvent.setup()

    server.use(
      http.get(apiBaseUrl + ENDPOINTS.auth.me, () => HttpResponse.json(mockUser)),
      http.get(apiBaseUrl + ENDPOINTS.poll.user, () => HttpResponse.json([mockPoll])),
    )

    renderHomePage()

    await waitFor(() => screen.getByRole('button', { name: /^entrar$/i }))
    await user.click(screen.getByRole('button', { name: /^entrar$/i }))

    expect(screen.getByText('Entrar em grupo')).toBeInTheDocument()
  })
})
