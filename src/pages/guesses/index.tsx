import { useState } from 'react'
import { Pencil, Target } from 'lucide-react'

import { type Game, useNextGamesQuery } from '@/entities/game'
import { type Guess, useParticipantGuessesQuery } from '@/entities/guess'
import { useUserPollsQuery } from '@/entities/poll'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import { GuessFormModal } from './ui/guess-form-modal'

function formatGameDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

interface GuessFormState {
  game: Game
  guess: Guess
}

export function GuessesPage() {
  const [participantId, setParticipantId] = useState('')
  const [selectedPollId, setSelectedPollId] = useState('')
  const [guessFormState, setGuessFormState] = useState<GuessFormState | null>(null)

  const gamesQuery = useNextGamesQuery({ limit: 20 })
  const pollsQuery = useUserPollsQuery()
  const myGuessesQuery = useParticipantGuessesQuery(participantId)

  const games = gamesQuery.data ?? []
  const polls = pollsQuery.data ?? []
  const myGuesses = myGuessesQuery.data ?? []

  const handleGuessSuccess = (newParticipantId: string) => {
    if (!participantId) {
      setParticipantId(newParticipantId)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-border bg-card p-4 md:p-5">
        <div className="flex items-center gap-2">
          <Target className="text-muted-foreground" />
          <div>
            <h1 className="text-lg font-semibold text-card-foreground">Meus Palpites</h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe e edite seus palpites nos jogos da Copa do Mundo.
            </p>
          </div>
        </div>
      </div>

      <section className="rounded-lg border border-border bg-card p-4 md:p-5">
        <div className="mb-4 flex items-center gap-2">
          <Target className="text-muted-foreground" />
          <h2 className="text-base font-semibold text-card-foreground">Palpites registrados</h2>
        </div>

        {!participantId && (
          <div className="rounded-lg border border-dashed border-border bg-background p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Você ainda não fez nenhum palpite. Acesse a página{' '}
              <strong>Início</strong> e clique em <strong>Palpitar</strong> em um dos jogos para começar.
            </p>
          </div>
        )}

        {participantId && myGuessesQuery.isPending && (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        )}

        {participantId && myGuessesQuery.isError && (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Não foi possível carregar seus palpites.
          </p>
        )}

        {participantId && !myGuessesQuery.isPending && !myGuessesQuery.isError && myGuesses.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum palpite encontrado.</p>
        )}

        {participantId && !myGuessesQuery.isPending && !myGuessesQuery.isError && myGuesses.length > 0 && (
          <div className="flex flex-col gap-2">
            {myGuesses.map((guess) => {
              const game = games.find((g) => g.id === guess.gameId)
              return (
                <div
                  key={guess.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3"
                >
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="truncate text-sm font-medium text-foreground">
                      {game
                        ? `${game.firstTeamName ?? game.firstTeamCountryCode} vs ${game.secondTeamName ?? game.secondTeamCountryCode}`
                        : 'Jogo não encontrado'}
                    </p>
                    {game && (
                      <p className="text-xs text-muted-foreground">{formatGameDate(game.date)}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 font-semibold">
                      <span className="flex size-8 items-center justify-center rounded border border-primary bg-primary/10 text-sm text-primary">
                        {guess.firstTeamPoints}
                      </span>
                      <span className="text-xs text-muted-foreground">×</span>
                      <span className="flex size-8 items-center justify-center rounded border border-primary bg-primary/10 text-sm text-primary">
                        {guess.secondTeamPoints}
                      </span>
                    </div>

                    {game && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setGuessFormState({ game, guess })}
                      >
                        <Pencil className="size-3.5" />
                        Editar
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {guessFormState && (
        <GuessFormModal
          game={guessFormState.game}
          guess={guessFormState.guess}
          pollId={selectedPollId}
          polls={polls}
          onChangePoll={setSelectedPollId}
          onClose={() => setGuessFormState(null)}
          onSuccess={handleGuessSuccess}
        />
      )}
    </div>
  )
}
