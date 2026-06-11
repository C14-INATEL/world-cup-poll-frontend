import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'

import { apiBaseUrl } from '@/shared/api/api'
import { ENDPOINTS } from '@/shared/constants/endpoints'
import { server } from '@/test/mocks/server'
import { renderWithProviders } from '@/test/setup/render-with-providers'
import { mockGame, mockGuess, mockPoll } from '@/test/fixtures'
import { GuessFormModal } from '@/pages/guesses/ui/guess-form-modal'

describe('GuessFormModal', () => {
  it('exibe modo criar quando nenhum palpite é passado', () => {
    renderWithProviders(
      <GuessFormModal
        game={mockGame}
        pollId=""
        polls={[mockPoll]}
        onChangePoll={vi.fn()}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    expect(screen.getByRole('heading', { name: /criar palpite/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('botão de submissão fica desabilitado sem bolão selecionado', () => {
    renderWithProviders(
      <GuessFormModal
        game={mockGame}
        pollId=""
        polls={[mockPoll]}
        onChangePoll={vi.fn()}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: /criar palpite/i })).toBeDisabled()
  })

  it('cria palpite com sucesso', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const onSuccess = vi.fn()

    server.use(
      http.post(apiBaseUrl + ENDPOINTS.guess.create(mockPoll.id), () =>
        HttpResponse.json(mockGuess),
      ),
    )

    renderWithProviders(
      <GuessFormModal
        game={mockGame}
        pollId={mockPoll.id}
        polls={[mockPoll]}
        onChangePoll={vi.fn()}
        onClose={onClose}
        onSuccess={onSuccess}
      />,
    )

    await user.click(screen.getByRole('button', { name: /criar palpite/i }))

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
      expect(onSuccess).toHaveBeenCalledWith(mockGuess.participantId)
    })
  })

  it('exibe modo editar quando palpite é passado', () => {
    renderWithProviders(
      <GuessFormModal
        game={mockGame}
        guess={mockGuess}
        pollId={mockPoll.id}
        polls={[mockPoll]}
        onChangePoll={vi.fn()}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    expect(screen.getByText('Editar palpite')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /salvar alterações/i })).toBeInTheDocument()

    const [firstInput, secondInput] = screen.getAllByRole('spinbutton') as HTMLInputElement[]
    expect(firstInput.value).toBe(String(mockGuess.firstTeamPoints))
    expect(secondInput.value).toBe(String(mockGuess.secondTeamPoints))
  })

  it('atualiza palpite com sucesso', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const onSuccess = vi.fn()

    server.use(
      http.put(
        apiBaseUrl + ENDPOINTS.guess.update(mockPoll.id, mockGuess.id),
        () => HttpResponse.json(mockGuess),
      ),
    )

    renderWithProviders(
      <GuessFormModal
        game={mockGame}
        guess={mockGuess}
        pollId={mockPoll.id}
        polls={[mockPoll]}
        onChangePoll={vi.fn()}
        onClose={onClose}
        onSuccess={onSuccess}
      />,
    )

    await user.click(screen.getByRole('button', { name: /salvar alterações/i }))

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
    })
  })
})
