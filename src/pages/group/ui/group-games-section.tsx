import { CalendarDays, Pencil, Plus, Users } from 'lucide-react'

import { type Game } from '@/entities/game'
import { type Guess, type UserGuess } from '@/entities/guess'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import { formatGameDate, getTeamName, toEditableGuess } from './group-page.helpers'

interface GroupGamesSectionProps {
  games: Game[]
  myGuesses: UserGuess[]
  hasPoll: boolean
  isPending: boolean
  isError: boolean
  onPalpitar: (game: Game, guess?: Guess) => void
  onVerPalpites: (game: Game) => void
}

interface GameCardProps {
  game: Game
  myGuess?: UserGuess
  hasPoll: boolean
  onPalpitar: (game: Game, guess?: Guess) => void
  onVerPalpites: (game: Game) => void
}

function GameCard({
  game,
  myGuess,
  hasPoll,
  onPalpitar,
  onVerPalpites,
}: GameCardProps) {
  const editableGuess = toEditableGuess(myGuess)

  return (
    <article className="rounded-lg border border-border bg-background p-3">
      <p className="text-center text-xs text-muted-foreground">{formatGameDate(game.date)}</p>

      <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex min-w-0 items-center justify-end gap-2">
          <p className="truncate text-right text-sm font-medium">{getTeamName(game, 'first')}</p>
          {game.firstTeamCrestUrl ? (
            <img
              src={game.firstTeamCrestUrl}
              alt={getTeamName(game, 'first')}
              className="size-9 shrink-0 rounded-full border border-border object-cover"
            />
          ) : (
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold">
              {game.firstTeamCountryCode}
            </div>
          )}
        </div>

        {myGuess ? (
          <div className="flex items-center gap-1 font-semibold">
            <span className="flex size-7 items-center justify-center rounded border border-primary bg-primary/10 text-xs text-primary">
              {myGuess.firstTeamPoints}
            </span>
            <span className="text-xs text-muted-foreground">x</span>
            <span className="flex size-7 items-center justify-center rounded border border-primary bg-primary/10 text-xs text-primary">
              {myGuess.secondTeamPoints}
            </span>
          </div>
        ) : (
          <span className="flex size-7 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold text-muted-foreground">
            VS
          </span>
        )}

        <div className="flex min-w-0 items-center gap-2">
          {game.secondTeamCrestUrl ? (
            <img
              src={game.secondTeamCrestUrl}
              alt={getTeamName(game, 'second')}
              className="size-9 shrink-0 rounded-full border border-border object-cover"
            />
          ) : (
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold">
              {game.secondTeamCountryCode}
            </div>
          )}
          <p className="truncate text-sm font-medium">{getTeamName(game, 'second')}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <Button size="sm" variant="outline" onClick={() => onVerPalpites(game)}>
          <Users className="size-3.5" />
          Ver palpites
        </Button>

        <Button
          size="sm"
          variant={editableGuess ? 'outline' : 'default'}
          disabled={!hasPoll || Boolean(myGuess && !editableGuess)}
          onClick={() => onPalpitar(game, editableGuess)}
        >
          {editableGuess ? <Pencil className="size-3.5" /> : <Plus className="size-3.5" />}
          {editableGuess ? 'Editar' : 'Palpitar'}
        </Button>
      </div>
    </article>
  )
}

export function GroupGamesSection({
  games,
  myGuesses,
  hasPoll,
  isPending,
  isError,
  onPalpitar,
  onVerPalpites,
}: GroupGamesSectionProps) {
  const getMyGuessForGame = (gameId: string) =>
    myGuesses.find((guess) => guess.game.id === gameId)

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays className="size-4 text-muted-foreground" />
        <h2 className="text-base font-semibold text-card-foreground">
          Jogos abertos para palpites
        </h2>
      </div>

      {isPending && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      )}

      {isError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Nao foi possivel carregar os jogos.
        </p>
      )}

      {!isPending && !isError && games.length === 0 && (
        <div className="rounded-lg border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
          Nenhum jogo futuro encontrado.
        </div>
      )}

      {!isPending && !isError && games.length > 0 && (
        <div className="flex flex-col gap-2">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              myGuess={getMyGuessForGame(game.id)}
              hasPoll={hasPoll}
              onPalpitar={onPalpitar}
              onVerPalpites={onVerPalpites}
            />
          ))}
        </div>
      )}
    </section>
  )
}
