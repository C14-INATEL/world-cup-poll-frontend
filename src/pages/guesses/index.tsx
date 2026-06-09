import { useState } from 'react'
import { Pencil, Target } from 'lucide-react'

import { type Game } from '@/entities/game'
import { type Guess, type UserGuess, useUserGuessesQuery } from '@/entities/guess'
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
  pollId: string
}

export function GuessesPage() {
  const [guessFormState, setGuessFormState] = useState<GuessFormState | null>(null)
  const [selectedPollId, setSelectedPollId] = useState('')

  const guessesQuery = useUserGuessesQuery({ page: 1, limit: 50 })
  const pollsQuery = useUserPollsQuery()

  const guesses = guessesQuery.data?.items ?? []
  const polls = pollsQuery.data ?? []

  const openEdit = (userGuess: UserGuess) => {
    setSelectedPollId(userGuess.poll.id)
    setGuessFormState({
      game: userGuess.game as unknown as Game,
      guess: {
        id: userGuess.id,
        firstTeamPoints: userGuess.firstTeamPoints,
        secondTeamPoints: userGuess.secondTeamPoints,
        createdAt: userGuess.createdAt,
        gameId: userGuess.game.id,
        participantId: userGuess.participant?.id ?? '',
      },
      pollId: userGuess.poll.id,
    })
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

        {guessesQuery.isPending && (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        )}

        {guessesQuery.isError && (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Não foi possível carregar seus palpites.
          </p>
        )}

        {!guessesQuery.isPending && !guessesQuery.isError && guesses.length === 0 && (
          <div className="rounded-lg border border-dashed border-border bg-background p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Você ainda não fez nenhum palpite. Acesse a página{' '}
              <strong>Início</strong> e clique em <strong>Palpitar</strong> em um dos jogos para começar.
            </p>
          </div>
        )}

        {!guessesQuery.isPending && !guessesQuery.isError && guesses.length > 0 && (
          <div className="flex flex-col gap-2">
            {guesses.map((guess) => (
              <div
                key={guess.id}
                className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3"
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="truncate text-sm font-medium text-foreground">
                    {`${guess.game.firstTeamName ?? guess.game.firstTeamCountryCode} vs ${guess.game.secondTeamName ?? guess.game.secondTeamCountryCode}`}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatGameDate(guess.game.date)}</p>
                  <p className="text-xs font-medium text-primary">{guess.poll.title}</p>
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

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(guess)}
                  >
                    <Pencil className="size-3.5" />
                    Editar
                  </Button>
                </div>
              </div>
            ))}
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
          onSuccess={() => {}}
        />
      )}
    </div>
  )
}
