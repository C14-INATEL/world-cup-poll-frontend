import { useState } from "react";
import { Copy, ExternalLink, LogIn, Pencil, Plus, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { type Poll } from "@/entities/poll";
import { EditPollModal } from "@/features/poll/edit-poll/edit-poll-modal";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { useAuth } from "@/app/providers/auth/use-auth";

interface HomeUserPollsSectionProps {
  polls: Poll[] | undefined;
  isPending: boolean;
  isError: boolean;
  onCreatePoll: () => void;
  onJoinPoll: () => void;
}

export function HomeUserPollsSection({
  polls,
  isPending,
  isError,
  onCreatePoll,
  onJoinPoll,
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
          <Button variant="outline" onClick={onJoinPoll}>
            <LogIn /> Entrar
          </Button>
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
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button variant="outline" onClick={onJoinPoll}>
              <LogIn /> Entrar em grupo
            </Button>
            <Button onClick={onCreatePoll}>
              <Plus /> Criar grupo
            </Button>
          </div>
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
                <Link
                  to={ROUTES.groupDetails(poll.code)}
                  className="text-lg font-medium text-foreground hover:underline"
                >
                  {poll.title}
                </Link>

                <div>

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
                  <Button
                    nativeButton={false}
                    size="sm"
                    variant="outline"
                    render={<Link to={ROUTES.groupDetails(poll.code)} />}
                  >
                    <ExternalLink className="size-3.5" />
                    Abrir
                  </Button>
                </div>
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
                      className={`flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground -ml-2 border border-white ${index > 0 ? "-ml-1" : ""}`}
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
