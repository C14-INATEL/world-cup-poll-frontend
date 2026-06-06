import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'

import { apiBaseUrl } from '@/shared/api/api'
import { ENDPOINTS } from '@/shared/constants/endpoints'
import { server } from '@/test/mocks/server'
import { renderWithProviders } from '@/test/setup/render-with-providers'
import { mockGame, mockGuess } from '@/test/fixtures'
import { GameGuessesModal } from '@/pages/guesses/ui/game-guesses-modal'

function renderModal(onClose = vi.fn()) {
  return renderWithProviders(<GameGuessesModal game={mockGame} onClose={onClose} />)
}

describe('GameGuessesModal', () => {
  it('exibe estado vazio quando não há palpites', async () => {
    server.use(
      http.get(apiBaseUrl + ENDPOINTS.guess.byGame(mockGame.id), () =>
        HttpResponse.json([]),
      ),
    )

    renderModal()

    await waitFor(() => {
      expect(screen.getByText(/nenhum palpite registrado/i)).toBeInTheDocument()
    })
  })

  it('lista os palpites do jogo', async () => {
    server.use(
      http.get(apiBaseUrl + ENDPOINTS.guess.byGame(mockGame.id), () =>
        HttpResponse.json([mockGuess]),
      ),
    )

    renderModal()

    await waitFor(() => {
      // participantId truncado aparece no card do palpite
      expect(screen.getByText(`${mockGuess.participantId.slice(0, 8)}…`)).toBeInTheDocument()
    })
  })

  it('exibe mensagem de erro quando a requisição falha', async () => {
    server.use(
      http.get(apiBaseUrl + ENDPOINTS.guess.byGame(mockGame.id), () =>
        HttpResponse.json({ error: 'Erro interno' }, { status: 500 }),
      ),
    )

    renderModal()

    await waitFor(() => {
      expect(screen.getByText(/não foi possível carregar os palpites/i)).toBeInTheDocument()
    })
  })
})
