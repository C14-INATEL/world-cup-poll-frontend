import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'

import { apiBaseUrl } from '@/shared/api/api'
import { ENDPOINTS } from '@/shared/constants/endpoints'
import { server } from '@/test/mocks/server'
import { renderWithProviders } from '@/test/setup/render-with-providers'
import { mockUser, mockPoll } from '@/test/fixtures'
import { InviteUserModal } from '@/pages/group/ui/invite-user-modal'

function renderModal(onClose = vi.fn()) {
  return renderWithProviders(
    <InviteUserModal pollId={mockPoll.id} onClose={onClose} />,
  )
}

describe('InviteUserModal', () => {
  it('exibe dica para digitar pelo menos 2 caracteres', () => {
    renderModal()

    expect(screen.getByText(/digite pelo menos 2 caracteres/i)).toBeInTheDocument()
  })

  it('exibe resultados após digitar 2 ou mais caracteres', async () => {
    const user = userEvent.setup()

    server.use(
      http.get(apiBaseUrl + ENDPOINTS.user.search, () =>
        HttpResponse.json([mockUser]),
      ),
    )

    renderModal()

    await user.type(screen.getByPlaceholderText('Buscar usuario'), 'Ana')

    await waitFor(() => {
      expect(screen.getByText(mockUser.name)).toBeInTheDocument()
      expect(screen.getByText(mockUser.email)).toBeInTheDocument()
    })
  })

  it('envia convite ao clicar em Convidar', async () => {
    const user = userEvent.setup()
    const capturedBody = vi.fn()

    server.use(
      http.get(apiBaseUrl + ENDPOINTS.user.search, () =>
        HttpResponse.json([mockUser]),
      ),
      http.post(apiBaseUrl + ENDPOINTS.invite.create, async ({ request }) => {
        capturedBody(await request.json())
        return HttpResponse.json({})
      }),
    )

    renderModal()

    await user.type(screen.getByPlaceholderText('Buscar usuario'), 'Ana')

    await waitFor(() => screen.getByRole('button', { name: /convidar/i }))
    await user.click(screen.getByRole('button', { name: /convidar/i }))

    await waitFor(() => {
      expect(capturedBody).toHaveBeenCalledWith({
        pollId: mockPoll.id,
        invitedUserId: mockUser.id,
      })
    })
  })
})
