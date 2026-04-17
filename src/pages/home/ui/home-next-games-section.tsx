import { CalendarDays, Pencil, Plus, Users } from 'lucide-react'

import { type Game } from '@/entities/game'
import { type Guess } from '@/entities/guess'
import { type Poll } from '@/entities/poll'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'

interface HomeNextGamesSectionProps {
  games: Game[] | undefined
  isPending: boolean
  isError: boolean
  myGuesses: Guess[]
  polls: Poll[]
  onPalpitar: (game: Game) => void
  onVerPalpites: (game: Game) => void
}

function formatGameDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

export function HomeNextGamesSection({
  games,
  isPending,
  isError,
  myGuesses,
  polls,
  onPalpitar,
  onVerPalpites,
}: HomeNextGamesSectionProps) {
  const getMyGuessForGame = (gameId: string) =>
    myGuesses.find((g) => g.gameId === gameId)

  return (
    <section className="rounded-lg border border-border bg-card p-4 md:p-5">
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays className="text-muted-foreground" />
        <h2 className="text-base font-semibold text-card-foreground">Próximos 5 jogos</h2>
      </div>

      {isPending && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {isError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Não foi possível carregar os jogos agora.
        </p>
      )}

      {!isPending && !isError && (games?.length ?? 0) === 0 && (
        <p className="text-sm text-muted-foreground">Nenhum jogo futuro encontrado.</p>
      )}

      {!isPending && !isError && (games?.length ?? 0) > 0 && (
        <div className="flex flex-col gap-2">
          {games?.map((game) => {
            const myGuess = getMyGuessForGame(game.id)
            return (
              <article key={game.id} className="rounded-lg border border-border bg-background p-3 md:p-4">
                <p className="text-center text-xs text-muted-foreground md:text-sm">
                  {formatGameDate(game.date)}
                </p>

                <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-5">
                  <div className="flex min-w-0 items-center justify-end gap-2 md:gap-3">
                    <p className="truncate text-right text-sm font-medium text-foreground md:text-base">
                      {game.firstTeamName ?? game.firstTeamCountryCode}
                    </p>
                    {game.firstTeamCrestUrl ? (
                      <img
                        src={game.firstTeamCrestUrl}
                        alt={`Escudo ${game.firstTeamName ?? game.firstTeamCountryCode}`}
                        className="size-10 shrink-0 rounded-full border border-border object-cover md:size-12"
                      />
                    ) : (
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold text-muted-foreground md:size-12">
                        {game.firstTeamCountryCode}
                      </div>
                    )}
                  </div>

                  {myGuess ? (
                    <div className="flex items-center gap-1 font-semibold">
                      <span className="flex size-8 items-center justify-center rounded border border-primary bg-primary/10 text-sm text-primary">
                        {myGuess.firstTeamPoints}
                      </span>
                      <span className="text-xs text-muted-foreground">×</span>
                      <span className="flex size-8 items-center justify-center rounded border border-primary bg-primary/10 text-sm text-primary">
                        {myGuess.secondTeamPoints}
                      </span>
                    </div>
                  ) : (
                    <span className="flex size-7 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold text-muted-foreground md:size-8">
                      VS
                    </span>
                  )}

                  <div className="flex min-w-0 items-center gap-2 md:gap-3">
                    {game.secondTeamCrestUrl ? (
                      <img
                        src={game.secondTeamCrestUrl}
                        alt={`Escudo ${game.secondTeamName ?? game.secondTeamCountryCode}`}
                        className="size-10 shrink-0 rounded-full border border-border object-cover md:size-12"
                      />
                    ) : (
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold text-muted-foreground md:size-12">
                        {game.secondTeamCountryCode}
                      </div>
                    )}
                    <p className="truncate text-sm font-medium text-foreground md:text-base">
                      {game.secondTeamName ?? game.secondTeamCountryCode}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <Button size="sm" variant="outline" onClick={() => onVerPalpites(game)}>
                    <Users className="size-3.5" />
                    Ver palpites
                  </Button>

                  {myGuess ? (
                    <Button size="sm" variant="outline" onClick={() => onPalpitar(game)}>
                      <Pencil className="size-3.5" />
                      Editar
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => onPalpitar(game)}
                      disabled={polls.length === 0}
                      title={polls.length === 0 ? 'Você precisa participar de um bolão' : undefined}
                    >
                      <Plus className="size-3.5" />
                      Palpitar
                    </Button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
