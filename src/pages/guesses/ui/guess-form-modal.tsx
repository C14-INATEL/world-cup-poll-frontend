import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { type Game } from '@/entities/game'
import { type Guess } from '@/entities/guess'
import { type Poll } from '@/entities/poll'
import { useCreateGuessMutation } from '@/features/guess/create-guess/use-create-guess-mutation'
import { useUpdateGuessMutation } from '@/features/guess/update-guess/use-update-guess-mutation'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'

const guessSchema = z.object({
  pollId: z.string().min(1, 'Selecione um bolão'),
  firstTeamPoints: z
    .number({ error: 'Informe um número' })
    .int('Deve ser inteiro')
    .min(0, 'Mínimo 0')
    .max(20, 'Máximo 20'),
  secondTeamPoints: z
    .number({ error: 'Informe um número' })
    .int('Deve ser inteiro')
    .min(0, 'Mínimo 0')
    .max(20, 'Máximo 20'),
})

type GuessFormData = z.infer<typeof guessSchema>

function formatGameDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

interface GuessFormModalProps {
  game: Game
  guess?: Guess
  pollId: string
  polls: Poll[]
  hidePollSelect?: boolean
  onChangePoll: (pollId: string) => void
  onClose: () => void
  onSuccess: (participantId: string) => void
}

export function GuessFormModal({
  game,
  guess,
  pollId,
  polls,
  hidePollSelect = false,
  onChangePoll,
  onClose,
  onSuccess,
}: GuessFormModalProps) {
  const isEditing = Boolean(guess)
  const createMutation = useCreateGuessMutation()
  const updateMutation = useUpdateGuessMutation()
  const isPending = createMutation.isPending || updateMutation.isPending

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<GuessFormData>({
    resolver: zodResolver(guessSchema),
    defaultValues: {
      pollId,
      firstTeamPoints: guess?.firstTeamPoints ?? 0,
      secondTeamPoints: guess?.secondTeamPoints ?? 0,
    },
  })

  useEffect(() => {
    setValue('pollId', pollId)
  }, [pollId, setValue])

  const handleClose = () => {
    if (isPending) return
    reset()
    onClose()
  }

  const onSubmit = async (data: GuessFormData) => {
    try {
      if (isEditing && guess) {
        const updated = await updateMutation.mutateAsync({
          pollId: data.pollId,
          guessId: guess.id,
          participantId: guess.participantId,
          gameId: game.id,
          firstTeamPoints: data.firstTeamPoints,
          secondTeamPoints: data.secondTeamPoints,
        })
        toast.success('Palpite atualizado com sucesso!')
        onSuccess(updated.participantId)
      } else {
        const created = await createMutation.mutateAsync({
          pollId: data.pollId,
          gameId: game.id,
          firstTeamPoints: data.firstTeamPoints,
          secondTeamPoints: data.secondTeamPoints,
        })
        toast.success('Palpite criado com sucesso!')
        onSuccess(created.participantId)
      }
      handleClose()
    } catch {
      // erros já tratados pelo interceptor do axios
    }
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) handleClose()
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar palpite' : 'Criar palpite'}</DialogTitle>
          <DialogDescription>
            Informe o placar que você acredita que vai acontecer.
          </DialogDescription>
        </DialogHeader>

        {/* Banner do jogo */}
        <div className="rounded-lg border border-border bg-muted/40 p-3">
          <p className="mb-2 text-center text-xs text-muted-foreground">
            {formatGameDate(game.date)}
          </p>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="flex min-w-0 items-center justify-end gap-2">
              <p className="truncate text-right text-sm font-medium">
                {game.firstTeamName ?? game.firstTeamCountryCode}
              </p>
              {game.firstTeamCrestUrl ? (
                <img
                  src={game.firstTeamCrestUrl}
                  alt={game.firstTeamName ?? game.firstTeamCountryCode}
                  className="size-8 shrink-0 rounded-full border border-border object-cover"
                />
              ) : (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs font-semibold">
                  {game.firstTeamCountryCode}
                </div>
              )}
            </div>
            <span className="flex size-6 items-center justify-center rounded-full border border-border bg-background text-xs font-semibold text-muted-foreground">
              VS
            </span>
            <div className="flex min-w-0 items-center gap-2">
              {game.secondTeamCrestUrl ? (
                <img
                  src={game.secondTeamCrestUrl}
                  alt={game.secondTeamName ?? game.secondTeamCountryCode}
                  className="size-8 shrink-0 rounded-full border border-border object-cover"
                />
              ) : (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs font-semibold">
                  {game.secondTeamCountryCode}
                </div>
              )}
              <p className="truncate text-sm font-medium">
                {game.secondTeamName ?? game.secondTeamCountryCode}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Seletor de bolão */}
          {!hidePollSelect && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">Bolão</label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={pollId}
                disabled={isEditing || isPending}
                onChange={(e) => {
                  onChangePoll(e.target.value)
                  setValue('pollId', e.target.value)
                }}
              >
                <option value="">Selecione um bolão...</option>
                {polls.map((poll) => (
                  <option key={poll.id} value={poll.id}>
                    {poll.title}
                  </option>
                ))}
              </select>
              {errors.pollId && (
                <p className="text-xs text-destructive">{errors.pollId.message}</p>
              )}
            </div>
          )}

          {/* Placar */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
            <div className="flex flex-col gap-1">
              <label className="truncate text-sm font-medium text-foreground">
                {game.firstTeamName ?? game.firstTeamCountryCode}
              </label>
              <Input
                type="number"
                min={0}
                max={20}
                disabled={isPending}
                {...register('firstTeamPoints', { valueAsNumber: true })}
              />
              {errors.firstTeamPoints && (
                <p className="text-xs text-destructive">{errors.firstTeamPoints.message}</p>
              )}
            </div>

            <span className="mb-1 text-center text-sm font-semibold text-muted-foreground">×</span>

            <div className="flex flex-col gap-1">
              <label className="truncate text-sm font-medium text-foreground">
                {game.secondTeamName ?? game.secondTeamCountryCode}
              </label>
              <Input
                type="number"
                min={0}
                max={20}
                disabled={isPending}
                {...register('secondTeamPoints', { valueAsNumber: true })}
              />
              {errors.secondTeamPoints && (
                <p className="text-xs text-destructive">{errors.secondTeamPoints.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending || !pollId}>
              {isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Criar palpite'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
