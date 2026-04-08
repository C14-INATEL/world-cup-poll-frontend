import { useState } from 'react'

import { useCreatePollMutation } from '@/features/poll/create-poll/use-create-poll-mutation'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'

interface CreatePollModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreatePollModal({ isOpen, onClose }: CreatePollModalProps) {
  const [pollTitle, setPollTitle] = useState('')
  const createPollMutation = useCreatePollMutation()

  if (!isOpen) {
    return null
  }

  const canSubmit = pollTitle.trim().length > 0 && !createPollMutation.isPending

  async function handleCreate() {
    await createPollMutation.mutateAsync({ title: pollTitle.trim() })
    setPollTitle('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-popover-foreground/50  p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-copa-border bg-popover p-8 text-center shadow-2xl shadow-black/20">
        <h2 className="mb-6 text-2xl font-bold">Criar grupo</h2>
        <Input
          placeholder="Nome do grupo"
          value={pollTitle}
          onChange={(event) => {
            setPollTitle(event.target.value)
          }}
          className="mb-6"
        />

        {createPollMutation.isError && (
          <div className="mb-6 rounded-lg border border-copa-error/30 bg-copa-error/10 px-4 py-3 text-left text-sm text-copa-error">
            {createPollMutation.error instanceof Error
              ? createPollMutation.error.message
              : 'Erro ao criar grupo'}
          </div>
        )}

        <div className="flex gap-4">
          <Button
            className="w-1/2"
            onClick={onClose}
            disabled={createPollMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            className="w-1/2"
            onClick={() => {
              void handleCreate()
            }}
            disabled={!canSubmit}
          >
            {createPollMutation.isPending ? 'Criando...' : 'Criar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
