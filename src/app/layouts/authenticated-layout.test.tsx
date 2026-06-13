import { describe, expect, it, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'

import { AuthenticatedLayout } from '@/app/layouts/authenticated-layout'
import { apiBaseUrl } from '@/shared/api/api'
import { ENDPOINTS } from '@/shared/constants/endpoints'
import { server } from '@/test/mocks/server'
import { renderWithProviders } from '@/test/setup/render-with-providers'
import { mockInvite, mockPoll, mockUser } from '@/test/fixtures'
import type { InviteStatus } from '@/entities/invite/types'

describe('AuthenticatedLayout', () => {
  beforeEach(() => {
    localStorage.setItem('auth_token', 'test-token')
  })

  it('permite aceitar convite pelo painel de notificacoes', async () => {
    const user = userEvent.setup()
    const capturedBody = vi.fn()
    let inviteStatus: InviteStatus = 'pending'

    server.use(
      http.get(apiBaseUrl + ENDPOINTS.auth.me, () => HttpResponse.json(mockUser)),
      http.get(apiBaseUrl + ENDPOINTS.invite.user, () =>
        HttpResponse.json([{ ...mockInvite, status: inviteStatus }]),
      ),
      http.patch(apiBaseUrl + ENDPOINTS.invite.update(mockInvite.id), async ({ request }) => {
        capturedBody(await request.json())
        inviteStatus = 'accepted'
        return HttpResponse.json({ ...mockInvite, status: 'accepted' })
      }),
      http.get(apiBaseUrl + ENDPOINTS.poll.user, () => HttpResponse.json([mockPoll])),
    )

    renderWithProviders(
      <AuthenticatedLayout>
        <div>Conteudo protegido</div>
      </AuthenticatedLayout>,
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /notificacoes: 1 convite pendente/i }))
        .toBeInTheDocument()
    })

    const notificationButton = await screen.findByRole('button', {
      name: /notificacoes/i,
    })

    await user.click(notificationButton)

    const acceptButton = await screen.findByRole('button', {
      name: /aceitar/i,
    })

    await user.click(acceptButton)

    expect(await screen.findByText(mockPoll.title)).toBeInTheDocument()

    await user.click(
      await screen.findByRole('button', {
        name: /aceitar/i,
      }),
    )

    await waitFor(() => {
      expect(
        screen.getByText(/nenhum convite pendente/i),
      ).toBeInTheDocument()
    })
  })
})
