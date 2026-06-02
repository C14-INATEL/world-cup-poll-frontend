import { Medal } from 'lucide-react'

import { type RankingEntry } from '@/entities/ranking'
import { Skeleton } from '@/shared/ui/skeleton'

interface GroupRankingPanelProps {
  ranking: RankingEntry[] | undefined
  participants: string[]
  isPending: boolean
  isError: boolean
}

export function GroupRankingPanel({
  ranking,
  participants,
  isPending,
  isError,
}: GroupRankingPanelProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex items-center gap-2">
        <Medal className="size-4 text-muted-foreground" />
        <h2 className="text-base font-semibold text-card-foreground">Ranking</h2>
      </div>

      {isPending && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      )}

      {isError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Nao foi possivel carregar o ranking.
        </p>
      )}

      {!isPending && !isError && (ranking?.length ?? 0) === 0 && (
        <div className="rounded-lg border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
          O ranking aparece quando os jogos finalizados pontuarem os palpites.
        </div>
      )}

      {!isPending && !isError && (ranking?.length ?? 0) > 0 && (
        <div className="flex flex-col gap-2">
          {ranking?.map((entry) => (
            <article
              key={entry.userId}
              className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
            >
              <strong className="text-sm text-muted-foreground">#{entry.position}</strong>
              <div className="flex size-9 items-center justify-center rounded-full border border-border bg-muted">
                <span className="text-xs font-semibold">
                  {entry.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{entry.name}</p>
                <p className="text-xs text-muted-foreground">
                  {entry.guessesCount} palpites
                </p>
              </div>
              <strong className="text-sm text-primary">{entry.totalPoints} pts</strong>
            </article>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        {participants.length} participantes no grupo.
      </p>
    </section>
  )
}
