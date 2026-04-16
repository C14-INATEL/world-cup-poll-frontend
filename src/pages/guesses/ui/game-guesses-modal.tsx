import { Eye } from 'lucide-react'

import { type Game } from '@/entities/game'
import { useGameGuessesQuery } from '@/entities/guess'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Skeleton } from '@/shared/ui/skeleton'

function formatGameDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

interface GameGuessesModalProps {
  game: Game
  onClose: () => void
}

export function GameGuessesModal({ game, onClose }: GameGuessesModalProps) {
  const { data: guesses, isPending, isError } = useGameGuessesQuery(game.id)

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="size-4" />
            Palpites do jogo
          </DialogTitle>
          <DialogDescription>
            {game.firstTeamName ?? game.firstTeamCountryCode} vs{' '}
            {game.secondTeamName ?? game.secondTeamCountryCode} —{' '}
            {formatGameDate(game.date)}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {isPending && (
            <>
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </>
          )}

          {isError && (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Não foi possível carregar os palpites.
            </p>
          )}

          {!isPending && !isError && (guesses?.length ?? 0) === 0 && (
            <div className="rounded-lg border border-dashed border-border bg-muted/40 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhum palpite registrado para este jogo ainda.
              </p>
            </div>
          )}

          {!isPending && !isError && (guesses?.length ?? 0) > 0 && (
            <div className="flex flex-col gap-2">
              {guesses?.map((guess, index) => (
                <div
                  key={guess.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                      {index + 1}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Participante{' '}
                      <span className="font-mono text-xs text-foreground">
                        {guess.participantId.slice(0, 8)}…
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1 font-semibold">
                    <span className="flex size-8 items-center justify-center rounded border border-border bg-primary/10 text-sm text-primary">
                      {guess.firstTeamPoints}
                    </span>
                    <span className="text-xs text-muted-foreground">×</span>
                    <span className="flex size-8 items-center justify-center rounded border border-border bg-primary/10 text-sm text-primary">
                      {guess.secondTeamPoints}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
