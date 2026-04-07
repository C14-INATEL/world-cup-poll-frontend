import { useState } from 'react'

import { CreatePollModal } from '@/features/poll/create-poll/ui/create-poll-modal'
import { Button } from '@/shared/ui/button'

export function HomeHero() {
  const [is_create_modal_open, set_is_create_modal_open] = useState(false)

  return (
    <div className="relative w-full max-w-md rounded-2xl border border-copa-border bg-copa-surface p-8 text-center shadow-2xl shadow-black/20">
      <h1 className="text-2xl font-bold text-copa-text">Bem-vindo</h1>
      <p className="mt-3 text-copa-text-muted">
        Participe do bolao da Copa. Crie um grupo para desafiar seus amigos e descobrir quem entende mais de futebol.
      </p>
      <Button
        variant="copa"
        size="copa"
        className="mt-8 w-full"
        onClick={() => {
          set_is_create_modal_open(true)
        }}
      >
        Criar grupo do bolao
      </Button>

      <CreatePollModal
        isOpen={is_create_modal_open}
        onClose={() => {
          set_is_create_modal_open(false)
        }}
      />
    </div>
  )
}
