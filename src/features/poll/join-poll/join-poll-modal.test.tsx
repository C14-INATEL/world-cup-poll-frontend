import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'

import { apiBaseUrl } from '@/shared/api/api'
import { ENDPOINTS } from '@/shared/constants/endpoints'
import { server } from '@/test/mocks/server'
import { renderWithProviders } from '@/test/setup/render-with-providers'
import { mockPoll } from '@/test/fixtures'
import { JoinPollModal } from '@/features/poll/join-poll/join-poll-modal'

function renderModal(onClose = vi.fn()) {
  return renderWithProviders(<JoinPollModal isOpen onClose={onClose} />)
}

describe('JoinPollModal', () => {
  it('renderiza o campo de código', () => {
    renderModal()

    expect(screen.getByLabelText('Codigo do grupo')).toBeInTheDocument()
  })

  it('botão Entrar fica desabilitado com código vazio', () => {
    renderModal()

    expect(screen.getByRole('button', { name: /^entrar$/i })).toBeDisabled()
  })

  it('entra no bolão e fecha o modal ao submeter código válido', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    server.use(
      http.post(apiBaseUrl + ENDPOINTS.poll.join, () => HttpResponse.json({})),
      http.get(apiBaseUrl + ENDPOINTS.poll.user, () => HttpResponse.json([mockPoll])),
    )

    renderModal(onClose)

    await user.type(screen.getByLabelText('Codigo do grupo'), mockPoll.code)

    expect(screen.getByRole('button', { name: /^entrar$/i })).not.toBeDisabled()

    await user.click(screen.getByRole('button', { name: /^entrar$/i }))

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
    })
  })
})
