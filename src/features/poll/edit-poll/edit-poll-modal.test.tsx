import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'

import { apiBaseUrl } from '@/shared/api/api'
import { ENDPOINTS } from '@/shared/constants/endpoints'
import { server } from '@/test/mocks/server'
import { renderWithProviders } from '@/test/setup/render-with-providers'
import { mockPoll } from '@/test/fixtures'
import { EditPollModal } from '@/features/poll/edit-poll/edit-poll-modal'

function renderModal(onClose = vi.fn()) {
  return renderWithProviders(<EditPollModal poll={mockPoll} onClose={onClose} />)
}

describe('EditPollModal', () => {
  it('renderiza com o título atual do bolão', () => {
    renderModal()

    expect(screen.getByLabelText('Nome do grupo')).toHaveValue(mockPoll.title)
  })

  it('atualiza o título do bolão e fecha o modal', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    server.use(
      http.patch(apiBaseUrl + ENDPOINTS.poll.update(mockPoll.id), () =>
        HttpResponse.json({ ...mockPoll, title: 'Bolao Atualizado' }),
      ),
      http.get(apiBaseUrl + ENDPOINTS.poll.user, () => HttpResponse.json([])),
    )

    renderModal(onClose)

    const titleInput = screen.getByLabelText('Nome do grupo')
    await user.clear(titleInput)
    await user.type(titleInput, 'Bolao Atualizado')
    await user.click(screen.getByRole('button', { name: /salvar/i }))

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
    })
  })

  it('exclui o bolão após confirmação e fecha o modal', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    server.use(
      http.delete(apiBaseUrl + ENDPOINTS.poll.delete(mockPoll.id), () =>
        HttpResponse.json({}),
      ),
      http.get(apiBaseUrl + ENDPOINTS.poll.user, () => HttpResponse.json([])),
    )

    renderModal(onClose)

    await user.click(screen.getByRole('button', { name: /excluir bolão/i }))

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
    })
  })
})
