import { useState } from 'react'
import { Search, Send, UserPlus } from 'lucide-react'
import { toast } from 'sonner'

import { useSearchUsersQuery } from '@/entities/user/use-search-users-query'
import { useCreateInviteMutation } from '@/features/invite'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Skeleton } from '@/shared/ui/skeleton'

interface InviteUserModalProps {
  pollId: string
  onClose: () => void
}

function getInitials(name: string) {
  const [firstName = '', secondName = ''] = name.trim().split(' ')
  return `${firstName.charAt(0)}${secondName.charAt(0)}`.toUpperCase() || 'U'
}

export function InviteUserModal({ pollId, onClose }: InviteUserModalProps) {
  const [query, setQuery] = useState('')
  const usersQuery = useSearchUsersQuery(query)
  const createInviteMutation = useCreateInviteMutation()

  const users = usersQuery.data ?? []
  const canSearch = query.trim().length >= 2

  const handleInvite = async (invitedUserId: string) => {
    await createInviteMutation.mutateAsync({ pollId, invitedUserId })
    toast.success('Convite enviado com sucesso!')
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="size-4" />
            Convidar usuario
          </DialogTitle>
          <DialogDescription>
            Pesquise por nome ou e-mail para enviar um convite ao grupo.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-8"
            value={query}
            placeholder="Buscar usuario"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className="flex max-h-80 flex-col gap-2 overflow-auto">
          {!canSearch && (
            <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Digite pelo menos 2 caracteres para buscar.
              </p>
            </div>
          )}

          {canSearch && usersQuery.isPending && (
            <>
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </>
          )}

          {canSearch && usersQuery.isError && (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Nao foi possivel buscar usuarios.
            </p>
          )}

          {canSearch && !usersQuery.isPending && !usersQuery.isError && users.length === 0 && (
            <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center">
              <p className="text-sm text-muted-foreground">Nenhum usuario encontrado.</p>
            </div>
          )}

          {users.map((user) => (
            <article
              key={user.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="text-xs font-semibold">{getInitials(user.name)}</span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>

              <Button
                size="sm"
                disabled={createInviteMutation.isPending}
                onClick={() => void handleInvite(user.id)}
              >
                <Send className="size-3.5" />
                Convidar
              </Button>
            </article>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
