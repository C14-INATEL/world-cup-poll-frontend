import { Link } from 'react-router-dom'
import { ArrowLeft, UserPlus } from 'lucide-react'

import { type Poll } from '@/entities/poll'
import { ROUTES } from '@/shared/constants/routes'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'

interface GroupHeaderSectionProps {
  poll: Poll | undefined
  currentUserId: string | undefined
  isPending: boolean
  onInvite: () => void
}

export function GroupHeaderSection({
  poll,
  currentUserId,
  isPending,
  onInvite,
}: GroupHeaderSectionProps) {
  return (
    <header className="rounded-lg border border-border bg-card p-4 md:p-5">
      <Button nativeButton={false} variant="ghost" size="sm" render={<Link to={ROUTES.home} />}>
        <ArrowLeft className="size-3.5" />
        Voltar
      </Button>

      <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          {isPending ? (
            <Skeleton className="h-8 w-64" />
          ) : (
            <h1 className="truncate text-2xl font-semibold text-card-foreground">
              {poll?.title}
            </h1>
          )}
          <p className="mt-1 text-sm text-muted-foreground">
            Criado por {poll?.ownerId === currentUserId ? 'voce' : poll?.ownerName}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
            <strong className="text-foreground">{poll?.participants.length ?? 0}</strong>{' '}
            participantes
          </div>
          <Button onClick={onInvite}>
            <UserPlus className="size-4" />
            Convidar usuario
          </Button>
        </div>
      </div>
    </header>
  )
}
