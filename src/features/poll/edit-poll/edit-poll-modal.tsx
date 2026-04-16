import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2 } from 'lucide-react'
import { z } from 'zod'
import { toast } from 'sonner'

import { type Poll } from '@/entities/poll'
import { useDeletePollMutation } from './use-delete-poll-mutation'
import { useUpdatePollMutation } from './use-update-poll-mutation'
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

const editPollSchema = z.object({
  title: z.string().min(1, 'Informe o nome do grupo'),
})

type EditPollFormValues = z.infer<typeof editPollSchema>

interface EditPollModalProps {
  poll: Poll
  onClose: () => void
}

export function EditPollModal({ poll, onClose }: EditPollModalProps) {
  const updateMutation = useUpdatePollMutation()
  const deleteMutation = useDeletePollMutation()

  const isPending = updateMutation.isPending || deleteMutation.isPending

  const form = useForm<EditPollFormValues>({
    resolver: zodResolver(editPollSchema),
    defaultValues: { title: poll.title },
  })

  useEffect(() => {
    form.reset({ title: poll.title })
  }, [poll, form])

  const handleClose = () => {
    if (isPending) return
    form.reset()
    onClose()
  }

  const handleSave = async (values: EditPollFormValues) => {
    await updateMutation.mutateAsync({ id: poll.id, title: values.title.trim() })
    toast.success('Bolão atualizado com sucesso!')
    handleClose()
  }

  const handleDelete = async () => {
    if (!confirm(`Tem certeza que deseja excluir o bolão "${poll.title}"? Esta ação não pode ser desfeita.`)) return
    await deleteMutation.mutateAsync(poll.id)
    toast.success('Bolão excluído com sucesso!')
    onClose()
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
          <DialogTitle>Editar bolão</DialogTitle>
          <DialogDescription>
            Altere o nome do grupo ou exclua-o permanentemente.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit((v) => { void handleSave(v) })}
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="edit-poll-title">
              Nome do grupo
            </label>
            <Input
              id="edit-poll-title"
              placeholder="Nome do grupo"
              disabled={isPending}
              {...form.register('title')}
            />
            {form.formState.errors.title && (
              <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-muted-foreground">Código</label>
            <Input value={poll.code} disabled />
            <p className="text-xs text-muted-foreground">O código do bolão não pode ser alterado.</p>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={() => { void handleDelete() }}
              disabled={isPending}
            >
              <Trash2 className="size-4" />
              {deleteMutation.isPending ? 'Excluindo...' : 'Excluir bolão'}
            </Button>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {updateMutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
