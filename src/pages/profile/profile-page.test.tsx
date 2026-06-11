import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { http, HttpResponse } from 'msw'

import { apiBaseUrl } from '@/shared/api/api'
import { ENDPOINTS } from '@/shared/constants/endpoints'
import { ROUTES } from '@/shared/constants/routes'
import { server } from '@/test/mocks/server'
import { renderWithProviders } from '@/test/setup/render-with-providers'
import { mockUser, emptyGuessesResponse } from '@/test/fixtures'
import { ProfilePage } from '@/pages/profile'

function setupCommonHandlers() {
  server.use(
    http.get(apiBaseUrl + ENDPOINTS.auth.me, () => HttpResponse.json(mockUser)),
    http.get(apiBaseUrl + ENDPOINTS.poll.user, () => HttpResponse.json([])),
    http.get(apiBaseUrl + ENDPOINTS.guess.user, () => HttpResponse.json(emptyGuessesResponse)),
  )
}

function renderProfilePage() {
  return renderWithProviders(
    <Routes>
      <Route path={ROUTES.profile} element={<ProfilePage />} />
    </Routes>,
    { initialEntries: [ROUTES.profile] },
  )
}

describe('ProfilePage', () => {
  beforeEach(() => {
    localStorage.setItem('auth_token', 'test-token')
  })

  it('renderiza o nome e e-mail do usuário no formulário', async () => {
    setupCommonHandlers()

    renderProfilePage()

    await waitFor(() => {
      expect(screen.getByLabelText('Nome')).toHaveValue(mockUser.name)
      expect(screen.getByLabelText('E-mail')).toHaveValue(mockUser.email)
    })
  })

  it('atualiza o nome do perfil com sucesso', async () => {
    const user = userEvent.setup()
    const capturedBody = vi.fn()

    setupCommonHandlers()
    server.use(
      http.patch(apiBaseUrl + ENDPOINTS.user.updateProfile, async ({ request }) => {
        capturedBody(await request.json())
        return HttpResponse.json({ ...mockUser, name: 'Novo Nome' })
      }),
    )

    renderProfilePage()

    const nameInput = await screen.findByLabelText('Nome')
    await user.clear(nameInput)
    await user.type(nameInput, 'Novo Nome')

    const saveButton = screen.getByRole('button', { name: /salvar alteracoes/i })
    expect(saveButton).not.toBeDisabled()
    await user.click(saveButton)

    await waitFor(() => {
      expect(capturedBody).toHaveBeenCalledWith({
        name: 'Novo Nome',
        email: mockUser.email,
      })
    })
  })

  it('exibe estado vazio de grupos', async () => {
    setupCommonHandlers()

    renderProfilePage()

    await waitFor(() => {
      expect(screen.getByText(/ainda nao participa de nenhum grupo/i)).toBeInTheDocument()
    })
  })
})
