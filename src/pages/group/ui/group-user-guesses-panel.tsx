import { Trophy } from 'lucide-react'

import { type Game } from '@/entities/game'
import { type UserGuess } from '@/entities/guess'
import { formatGameDate, getTeamName } from './group-page.helpers'

interface GroupUserGuessesPanelProps {
  guesses: UserGuess[]
  firstGame?: Game
  onAddGuess: (game: Game) => void
}

export function GroupUserGuessesPanel({
  guesses,
}: GroupUserGuessesPanelProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex items-center gap-2">
        <Trophy className="size-4 text-muted-foreground" />
        <h2 className="text-base font-semibold text-card-foreground">Seus palpites</h2>

      </div>

      {guesses.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
          Voce ainda nao registrou palpites neste grupo.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {guesses.map((guess) => (
            <article
              key={guess.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {getTeamName(guess.game, 'first')} vs {getTeamName(guess.game, 'second')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatGameDate(guess.game.date)}
                </p>
              </div>

              <div className="flex items-center gap-1 font-semibold">
                <span className="flex size-7 items-center justify-center rounded border border-primary bg-primary/10 text-xs text-primary">
                  {guess.firstTeamPoints}
                </span>
                <span className="text-xs text-muted-foreground">x</span>
                <span className="flex size-7 items-center justify-center rounded border border-primary bg-primary/10 text-xs text-primary">
                  {guess.secondTeamPoints}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
