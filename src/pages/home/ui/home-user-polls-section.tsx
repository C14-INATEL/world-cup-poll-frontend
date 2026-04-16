import { useState } from "react";
import { Copy, Pencil, Plus, Users } from "lucide-react";
import { toast } from "sonner";

import { type Poll } from "@/entities/poll";
import { EditPollModal } from "@/features/poll/edit-poll/edit-poll-modal";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { useAuth } from "@/app/providers/auth/use-auth";

interface HomeUserPollsSectionProps {
  polls: Poll[] | undefined;
  isPending: boolean;
  isError: boolean;
  onCreatePoll: () => void;
}

export function HomeUserPollsSection({
  polls,
  isPending,
  isError,
  onCreatePoll,
}: HomeUserPollsSectionProps) {
  const { user } = useAuth();
  const [editingPoll, setEditingPoll] = useState<Poll | null>(null);

  const hasNoPolls = (polls?.length ?? 0) === 0;

  return (
    <section className="rounded-lg border border-border bg-card p-4 md:p-5">
      <div className="mb-4 flex items-center gap-2">
        <Users className="text-muted-foreground" />
        <h2 className="text-base font-semibold text-card-foreground">Meus grupos</h2>

        <div className="ml-auto flex gap-2">
          <Button onClick={onCreatePoll}>
            <Plus /> Novo
          </Button>
        </div>
      </div>

      {isPending && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      )}

      {isError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Não foi possível carregar seus grupos.
        </p>
      )}

      {!isPending && !isError && hasNoPolls && (
        <div className="rounded-lg border border-dashed border-border bg-background p-4">
          <p className="text-sm text-muted-foreground">Você ainda não participa de nenhum grupo.</p>
          <Button className="mt-4 w-full" onClick={onCreatePoll}>
            Criar meu primeiro grupo
          </Button>
        </div>
      )}

      {!isPending && !isError && !hasNoPolls && (
        <div className="flex flex-col gap-2">
          {polls?.map((poll) => (
            <article
              key={poll.id}
              className="rounded-lg border border-border bg-background px-4 py-3"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-lg font-medium text-foreground">{poll.title}</p>

                {poll.ownerId === user?.id && (
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-label="Editar bolão"
                    onClick={() => setEditingPoll(poll)}
                  >
                    <Pencil className="size-3.5" />
                    Editar
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Código:
                  <strong className="ml-1 text-primary" id={`poll-code-${poll.code}`}>
                    {poll.code}
                  </strong>
                </p>

                <Button
                  aria-label="Copiar código"
                  title="Copiar código"
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    const pollCodeEl = document.getElementById(`poll-code-${poll.code}`);
                    if (pollCodeEl && navigator.clipboard && window.isSecureContext) {
                      void navigator.clipboard.writeText(pollCodeEl.textContent ?? "").then(() => {
                        toast.success("Código copiado com sucesso!");
                      });
                    }
                  }}
                >
                  <Copy />
                </Button>
              </div>

              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground">
                  Criado por{" "}
                  {poll.ownerId === user?.id ? (
                    <span className="px-2 py-0.5 rounded border border-primary bg-primary/20 text-primary font-semibold">
                      você
                    </span>
                  ) : (
                    poll.ownerName
                  )}
                </p>

                <div className="flex items-center gap-1">
                  {poll.participants.slice(0, 4).map((participant, index) => (
                    <figure
                      key={participant}
                      title={participant}
                      className={`flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground z-[${index + 2}] ${index > 0 ? "-ml-1" : ""}`}
                    >
                      <span className="text-xs font-semibold">
                        {participant.charAt(0).toUpperCase()}
                      </span>
                    </figure>
                  ))}

                  {poll.participants.length > 4 && (
                    <p>+ {poll.participants.length - 4} participantes</p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {editingPoll && (
        <EditPollModal
          poll={editingPoll}
          onClose={() => setEditingPoll(null)}
        />
      )}
    </section>
  );
}
