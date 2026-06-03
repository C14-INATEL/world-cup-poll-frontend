import { Trophy } from 'lucide-react'

import { type PollGuess, type UserGuess } from '@/entities/guess'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { formatGameDate, getTeamName } from './group-page.helpers'

interface LastResultsModalProps {
  guesses: Array<PollGuess | UserGuess>
  currentUserName: string
  onClose: () => void
}

export function LastResultsModal({
  guesses,
  currentUserName,
  onClose,
}: LastResultsModalProps) {
  const completedGuesses = guesses
    .filter((guess) => guess.result.points !== null)
    .sort((first, second) => {
      return new Date(second.game.date).getTime() - new Date(first.game.date).getTime()
    })

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="size-4" />
            Resultados recentes
          </DialogTitle>
          <DialogDescription>
            Jogos encerrados do grupo com a pontuacao de cada usuario.
          </DialogDescription>
        </DialogHeader>

        {completedGuesses.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center">
            <p className="text-sm text-muted-foreground">Nenhum resultado finalizado ainda.</p>
          </div>
        ) : (
          <div className="flex max-h-[70vh] flex-col gap-2 overflow-auto">
            {completedGuesses.map((guess) => (
              <article
                key={guess.id}
                className="rounded-lg border border-border bg-background p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {getTeamName(guess.game, 'first')} vs {getTeamName(guess.game, 'second')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatGameDate(guess.game.date)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 font-semibold">
                    <span className="flex size-8 items-center justify-center rounded border border-border bg-muted text-sm">
                      {guess.game.firstTeamGoals ?? '-'}
                    </span>
                    <span className="text-xs text-muted-foreground">x</span>
                    <span className="flex size-8 items-center justify-center rounded border border-border bg-muted text-sm">
                      {guess.game.secondTeamGoals ?? '-'}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 rounded-md bg-muted/40 px-3 py-2">
                  <p className="truncate text-sm text-muted-foreground">
                    {guess.participant?.name ?? currentUserName}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{guess.result.status}</span>
                    <strong className="text-sm text-primary">
                      {guess.result.points} pts
                    </strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
