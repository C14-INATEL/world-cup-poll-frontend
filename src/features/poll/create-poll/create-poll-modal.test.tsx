import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'

import { apiBaseUrl } from '@/shared/api/api'
import { ENDPOINTS } from '@/shared/constants/endpoints'
import { server } from '@/test/mocks/server'
import { renderWithProviders } from '@/test/setup/render-with-providers'
import { mockPoll } from '@/test/fixtures'
import { CreatePollModal } from '@/features/poll/create-poll/create-poll-modal'

function renderModal(onClose = vi.fn()) {
  return renderWithProviders(<CreatePollModal isOpen onClose={onClose} />)
}

describe('CreatePollModal', () => {
  it('renderiza os campos do formulário', () => {
    server.use(
      http.get(apiBaseUrl + ENDPOINTS.poll.user, () => HttpResponse.json([])),
    )

    renderModal()

    expect(screen.getByLabelText('Nome do grupo')).toBeInTheDocument()
    expect(screen.getByLabelText('Código do grupo')).toBeInTheDocument()
  })

  it('botão Criar fica desabilitado com campos vazios', () => {
    server.use(
      http.get(apiBaseUrl + ENDPOINTS.poll.user, () => HttpResponse.json([])),
    )

    renderModal()

    expect(screen.getByRole('button', { name: /^criar$/i })).toBeDisabled()
  })

  it('gera código aleatório ao clicar em Gerar', async () => {
    const user = userEvent.setup()

    server.use(
      http.get(apiBaseUrl + ENDPOINTS.poll.user, () => HttpResponse.json([])),
    )

    renderModal()

    const codeInput = screen.getByLabelText('Código do grupo') as HTMLInputElement

    expect(codeInput.value).toBe('')

    await user.click(screen.getByRole('button', { name: /gerar/i }))

    expect(codeInput.value).toHaveLength(10)
  })

  it('cria bolão e fecha o modal ao submeter formulário válido', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    server.use(
      http.post(apiBaseUrl + ENDPOINTS.poll.create, () => HttpResponse.json(mockPoll)),
      http.get(apiBaseUrl + ENDPOINTS.poll.user, () => HttpResponse.json([mockPoll])),
    )

    renderModal(onClose)

    await user.type(screen.getByLabelText('Nome do grupo'), 'Meu Bolao')
    await user.click(screen.getByRole('button', { name: /gerar/i }))

    expect(screen.getByRole('button', { name: /^criar$/i })).not.toBeDisabled()

    await user.click(screen.getByRole('button', { name: /^criar$/i }))

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
    })
  })
})
