import { useState } from 'react'

import { useCreatePollMutation } from '@/features/poll/create-poll/api/use-create-poll-mutation'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'

interface CreatePollModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreatePollModal({ isOpen, onClose }: CreatePollModalProps) {
  const [poll_title, set_poll_title] = useState('')
  const create_poll_mutation = useCreatePollMutation()

  if (!isOpen) {
    return null
  }

  const can_submit = poll_title.trim().length > 0 && !create_poll_mutation.isPending

  async function handle_create() {
    await create_poll_mutation.mutateAsync({ title: poll_title.trim() })
    set_poll_title('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-copa-bg/80 p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-copa-border bg-copa-surface p-8 text-center shadow-2xl shadow-black/20">
        <h2 className="mb-6 text-2xl font-bold text-copa-text">Criar grupo</h2>
        <Input
          placeholder="Nome do grupo"
          value={poll_title}
          onChange={(event) => {
            set_poll_title(event.target.value)
          }}
          className="mb-6"
        />

        {create_poll_mutation.isError && (
          <div className="mb-6 rounded-lg border border-copa-error/30 bg-copa-error/10 px-4 py-3 text-left text-sm text-copa-error">
            {create_poll_mutation.error instanceof Error
              ? create_poll_mutation.error.message
              : 'Erro ao criar grupo'}
          </div>
        )}

        <div className="flex gap-4">
          <Button
            variant="copa-ghost"
            size="copa"
            className="w-1/2"
            onClick={onClose}
            disabled={create_poll_mutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            variant="copa"
            size="copa"
            className="w-1/2"
            onClick={() => {
              void handle_create()
            }}
            disabled={!can_submit}
          >
            {create_poll_mutation.isPending ? 'Criando...' : 'Criar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
