import { Trophy } from 'lucide-react'

import { type PollGuess, type UserGuess } from '@/entities/guess'
import { Button } from '@/shared/ui/button'
import { getTeamName } from './group-page.helpers'

interface GroupLastResultSectionProps {
  latestCompletedGuess: PollGuess | UserGuess | undefined
  onViewMore: () => void
}

export function GroupLastResultSection({
  latestCompletedGuess,
  onViewMore,
}: GroupLastResultSectionProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-4 md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="size-4 text-muted-foreground" />
            <h2 className="text-base font-semibold text-card-foreground">Ultimo resultado</h2>
          </div>
          {latestCompletedGuess ? (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <p className="text-sm text-muted-foreground">
                {getTeamName(latestCompletedGuess.game, 'first')} vs{' '}
                {getTeamName(latestCompletedGuess.game, 'second')}
              </p>
              <div className="flex items-center gap-1 font-semibold">
                <span className="flex size-8 items-center justify-center rounded border border-border bg-muted text-sm">
                  {latestCompletedGuess.game.firstTeamGoals ?? '-'}
                </span>
                <span className="text-xs text-muted-foreground">x</span>
                <span className="flex size-8 items-center justify-center rounded border border-border bg-muted text-sm">
                  {latestCompletedGuess.game.secondTeamGoals ?? '-'}
                </span>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Nenhum jogo encerrado com pontuacao por enquanto.
            </p>
          )}
        </div>

        <Button variant="outline" onClick={onViewMore}>
          Ver mais
        </Button>
      </div>
    </section>
  )
}
