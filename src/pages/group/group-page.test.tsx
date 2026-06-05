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
import { mockUser, mockPoll, emptyGuessesResponse } from '@/test/fixtures'
import { GroupPage } from '@/pages/group'

function setupCommonHandlers(polls = [mockPoll]) {
  server.use(
    http.get(apiBaseUrl + ENDPOINTS.auth.me, () => HttpResponse.json(mockUser)),
    http.get(apiBaseUrl + ENDPOINTS.poll.user, () => HttpResponse.json(polls)),
    http.get(apiBaseUrl + ENDPOINTS.game.list, () => HttpResponse.json([])),
    http.get(apiBaseUrl + ENDPOINTS.guess.user, () => HttpResponse.json(emptyGuessesResponse)),
    http.get(apiBaseUrl + ENDPOINTS.ranking.byPoll(mockPoll.id), () => HttpResponse.json([])),
    http.get(apiBaseUrl + ENDPOINTS.guess.byPoll(mockPoll.id), () => HttpResponse.json([])),
  )
}

function renderGroupPage(pollCode: string) {
  return renderWithProviders(
    <Routes>
      <Route path={ROUTES.group} element={<GroupPage />} />
      <Route path={ROUTES.home} element={<div>Home</div>} />
    </Routes>,
    { initialEntries: [ROUTES.groupDetails(pollCode)] },
  )
}

describe('GroupPage', () => {
  beforeEach(() => {
    localStorage.setItem('auth_token', 'test-token')
  })

  it('redireciona para home quando o código do bolão não é encontrado', async () => {
    setupCommonHandlers([])

    renderGroupPage('NOTFOUND1')

    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument()
    })
  })

  it('renderiza o cabeçalho com título e botão de convite', async () => {
    setupCommonHandlers()

    renderGroupPage(mockPoll.code)

    await waitFor(() => {
      expect(screen.getByText(mockPoll.title)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /convidar usuario/i })).toBeInTheDocument()
    })
  })

  it('abre o modal de convite ao clicar em Convidar usuario', async () => {
    const user = userEvent.setup()

    setupCommonHandlers()

    renderGroupPage(mockPoll.code)

    await waitFor(() => screen.getByRole('button', { name: /convidar usuario/i }))
    await user.click(screen.getByRole('button', { name: /convidar usuario/i }))

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Buscar usuario')).toBeInTheDocument()
    })
  })
})
