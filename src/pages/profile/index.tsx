import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  type LucideIcon,
  Mail,
  RotateCcw,
  Save,
  Target,
  UserRound,
  UsersRound,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  type GuessResultStatus,
  type PollGuess,
  type UserGuess,
  usePollGuessesQuery,
  useUserGuessesQuery,
} from "@/entities/guess";
import { type Poll, useUserPollsQuery } from "@/entities/poll";
import { type User } from "@/entities/user/types";
import { useCurrentUserQuery } from "@/entities/user/use-current-user-query";
import { useUpdateProfileMutation } from "@/features/user/edit-profile/use-update-profile-mutation";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Skeleton } from "@/shared/ui/skeleton";

const profileSchema = z.object({
  name: z.string().trim().min(1, "Informe seu nome"),
  email: z.email("Formato de e-mail invalido").min(1, "Informe seu e-mail"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const STATUS_STYLES: Record<GuessResultStatus, string> = {
  Pendente: "border-amber-500/30 bg-amber-500/10 text-amber-700",
  Acertou: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
  Parcial: "border-sky-500/30 bg-sky-500/10 text-sky-700",
  Errou: "border-rose-500/30 bg-rose-500/10 text-rose-700",
};

const USER_GUESSES_PAGE_SIZE = 8;

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getGameLabel(game: UserGuess["game"]) {
  const firstTeam = game.firstTeamName ?? game.firstTeamCountryCode;
  const secondTeam = game.secondTeamName ?? game.secondTeamCountryCode;
  return `${firstTeam} vs ${secondTeam}`;
}

function getParticipantCountLabel(count: number) {
  return count === 1 ? "1 participante" : `${count} participantes`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function SectionTitle({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
          <Icon aria-hidden="true" className="size-4" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-card-foreground">{title}</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Nao foi possivel atualizar o perfil";
}

function ProfileForm({ user }: { user: User }) {
  const updateProfileMutation = useUpdateProfileMutation();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const isPending = updateProfileMutation.isPending;

  async function handleSubmit(values: ProfileFormValues) {
    try {
      const updatedUser = await updateProfileMutation.mutateAsync(values);
      form.reset({
        name: updatedUser.name,
        email: updatedUser.email,
      });
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      form.setError("root", { message: getErrorMessage(error) });
    }
  }

  function handleReset() {
    form.reset({
      name: user.name,
      email: user.email,
    });
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit((values) => {
        void handleSubmit(values);
      })}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" htmlFor="profile-name">
            Nome
          </label>
          <div className="relative">
            <UserRound
              aria-hidden="true"
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="profile-name"
              autoComplete="name"
              className="pl-10"
              disabled={isPending}
              placeholder="Seu nome"
              {...form.register("name")}
            />
          </div>
          {form.formState.errors.name && (
            <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" htmlFor="profile-email">
            E-mail
          </label>
          <div className="relative">
            <Mail
              aria-hidden="true"
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="profile-email"
              autoComplete="email"
              className="pl-10"
              disabled={true}
              placeholder="seuemail@email.com"
              type="email"
              {...form.register("email")}
            />
          </div>
          {form.formState.errors.email && (
            <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
          )}
        </div>
      </div>

      {form.formState.errors.root && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {form.formState.errors.root.message}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
        <Button
          disabled={isPending || !form.formState.isDirty}
          onClick={handleReset}
          type="button"
          variant="outline"
        >
          <RotateCcw aria-hidden="true" className="size-4" />
          Descartar
        </Button>
        <Button disabled={isPending || !form.formState.isDirty} type="submit">
          <Save aria-hidden="true" className="size-4" />
          {isPending ? "Salvando..." : "Salvar alteracoes"}
        </Button>
      </div>
    </form>
  );
}

function PollGuessCard({ guess }: { guess: PollGuess }) {
  return (
    <div className="grid gap-3 rounded-lg border border-border bg-background p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {getInitials(guess.participant.name)}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-medium text-foreground">{guess.participant.name}</p>
            <span
              className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[guess.result.status]}`}
            >
              {guess.result.status}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{getGameLabel(guess.game)}</p>
          <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(guess.createdAt)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-card px-3 py-2 sm:min-w-36 sm:justify-center">
        <div className="flex items-center gap-1 font-semibold">
          <span className="flex size-8 items-center justify-center rounded border border-primary/20 bg-primary/10 text-primary">
            {guess.firstTeamPoints}
          </span>
          <span className="text-xs text-muted-foreground">x</span>
          <span className="flex size-8 items-center justify-center rounded border border-primary/20 bg-primary/10 text-primary">
            {guess.secondTeamPoints}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {guess.result.points !== null ? `${guess.result.points} pts` : "- pts"}
        </p>
      </div>
    </div>
  );
}

function PollGuessesModal({ poll, onClose }: { poll: Poll; onClose: () => void }) {
  const pollGuessesQuery = usePollGuessesQuery(poll.id);
  const guesses = pollGuessesQuery.data ?? [];

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye aria-hidden="true" className="size-4" />
            Palpites do grupo
          </DialogTitle>
          <DialogDescription>
            {poll.title} - palpites dos outros participantes deste grupo.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 rounded-lg border border-border bg-muted/40 p-3 sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Grupo</p>
            <p className="truncate text-sm font-medium text-foreground">{poll.title}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Participantes</p>
            <p className="text-sm font-medium text-foreground">
              {getParticipantCountLabel(poll.participants.length)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Palpites exibidos</p>
            <p className="text-sm font-medium text-foreground">{guesses.length}</p>
          </div>
        </div>

        {pollGuessesQuery.isPending && (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        )}

        {pollGuessesQuery.isError && (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Nao foi possivel carregar os palpites deste grupo.
          </p>
        )}

        {!pollGuessesQuery.isPending && !pollGuessesQuery.isError && guesses.length === 0 && (
          <div className="rounded-lg border border-dashed border-border bg-muted/40 p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Ainda nao existem palpites de outras pessoas neste grupo.
            </p>
          </div>
        )}

        {guesses.length > 0 && (
          <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto pr-1">
            {guesses.map((guess) => (
              <PollGuessCard key={guess.id} guess={guess} />
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={onClose} type="button" variant="outline">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function UserPollsSection({
  polls,
  isPending,
  isError,
  onOpenGuesses,
}: {
  polls: Poll[];
  isPending: boolean;
  isError: boolean;
  onOpenGuesses: (poll: Poll) => void;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-4 md:p-5">
      <SectionTitle
        description="Grupos que voce participa e palpites das outras pessoas."
        icon={UsersRound}
        title="Meus grupos"
      />

      {isPending && (
        <div className="mt-4 flex flex-col gap-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {isError && (
        <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Nao foi possivel carregar seus grupos.
        </p>
      )}

      {!isPending && !isError && polls.length === 0 && (
        <div className="mt-4 rounded-lg border border-dashed border-border bg-background p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Voce ainda nao participa de nenhum grupo.
          </p>
        </div>
      )}

      {polls.length > 0 && (
        <div className="grid gap-3">
          {polls.map((poll) => (
            <div
              key={poll.id}
              className="grid gap-4 rounded-lg border border-border bg-background p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
            >
              <div className="flex min-w-0 gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-sm font-semibold text-primary">
                  {getInitials(poll.title) || "G"}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-base font-medium text-foreground">{poll.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Codigo <span className="font-mono text-foreground">{poll.code}</span>
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded border border-border bg-card px-2 py-1">
                      {getParticipantCountLabel(poll.participants.length)}
                    </span>
                    <span className="rounded border border-border bg-card px-2 py-1">
                      Dono: <span className="text-foreground">{poll.ownerName}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <div className="flex items-center">
                  {poll.participants.slice(0, 4).map((participant, index) => (
                    <figure
                      key={`${poll.id}-${participant}-${index}`}
                      title={participant}
                      className={`flex size-7 items-center justify-center rounded-full border border-card bg-primary text-xs font-semibold text-primary-foreground ${index > 0 ? "-ml-2" : ""}`}
                    >
                      {participant.charAt(0).toUpperCase()}
                    </figure>
                  ))}
                </div>

                <Button onClick={() => onOpenGuesses(poll)} size="sm" type="button" variant="outline">
                  <Eye aria-hidden="true" className="size-4" />
                  Ver palpites
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function ProfilePage() {
  const userQuery = useCurrentUserQuery();
  const user = userQuery.data;
  const pollsQuery = useUserPollsQuery();
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);

  const [page, setPage] = useState(1);
  const [guesses, setGuesses] = useState<UserGuess[]>([]);
  const [hasMoreGuesses, setHasMoreGuesses] = useState(false);
  const userGuessesQuery = useUserGuessesQuery({
    page,
    limit: USER_GUESSES_PAGE_SIZE,
  });

  useEffect(() => {
    if (!userGuessesQuery.data || userGuessesQuery.data.page !== page) {
      return;
    }

    setHasMoreGuesses(userGuessesQuery.data.hasMore);
    setGuesses((current) =>
      page === 1 ? userGuessesQuery.data.items : [...current, ...userGuessesQuery.data.items],
    );
  }, [page, userGuessesQuery.data]);

  const isInitialGuessesLoading = userGuessesQuery.isPending && guesses.length === 0;
  const isLoadingMore = userGuessesQuery.isFetching && page > 1;
  const shouldShowErrorBanner = userGuessesQuery.isError && guesses.length === 0;
  const shouldShowInlineError = userGuessesQuery.isError && guesses.length > 0;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 xl:flex-row">
      <div className="flex w-full flex-col gap-6 xl:flex-1">
        <header className="rounded-lg border border-border bg-card p-4 md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-base font-semibold text-primary">
                {user ? getInitials(user.name) : <UserRound aria-hidden="true" className="size-5" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase text-muted-foreground">Perfil</p>
                <h1 className="truncate text-xl font-semibold text-card-foreground">
                  {user?.name ?? "Minha conta"}
                </h1>
                <p className="truncate text-sm text-muted-foreground">
                  {user?.email ?? "Mantenha seus dados atualizados para identificar seus palpites e grupos."}
                </p>
              </div>
            </div>

          </div>
        </header>

        <section className="rounded-lg border border-border bg-card p-4 md:p-5">
          <SectionTitle
            description="Atualize o nome exibido nos seus grupos e palpites."
            icon={UserRound}
            title="Informacoes do usuario"
          />

          {userQuery.isPending && (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-32 self-end" />
            </div>
          )}

          {userQuery.isError && (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Nao foi possivel carregar seus dados.
            </p>
          )}

          {!userQuery.isPending && !userQuery.isError && user && <ProfileForm user={user} />}
        </section>

        <UserPollsSection
          isError={pollsQuery.isError}
          isPending={pollsQuery.isPending}
          onOpenGuesses={setSelectedPoll}
          polls={pollsQuery.data ?? []}
        />
      </div>

      <aside className="w-full xl:w-90 xl:shrink-0">
        <section className="rounded-lg border border-border bg-card p-4 md:p-5 xl:sticky xl:top-6">
          <SectionTitle
            action={
              guesses.length > 0 ? (
                <span className="rounded-full border border-border bg-background px-2 py-1 text-xs text-muted-foreground">
                  {userGuessesQuery.data?.total ?? guesses.length}
                </span>
              ) : undefined
            }
            description="Todos os seus palpites nos boloes que participa."
            icon={Target}
            title="Todos os palpites"
          />

          {isInitialGuessesLoading && (
            <div className="mt-4 flex flex-col gap-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          )}

          {shouldShowErrorBanner && (
            <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Nao foi possivel carregar seus palpites.
            </p>
          )}

          {!userGuessesQuery.isPending && !userGuessesQuery.isError && guesses.length === 0 && (
            <div className="mt-4 rounded-lg border border-dashed border-border bg-background p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Voce ainda nao possui palpites cadastrados.
              </p>
            </div>
          )}

          {guesses.length > 0 && (
            <div className="mt-4 flex max-h-[calc(100vh-14rem)] flex-col gap-3 overflow-y-auto pr-1">
              {guesses.map((guess) => (
                <div
                  key={guess.id}
                  className="flex flex-col gap-2 rounded-lg border border-border bg-background p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-xs font-semibold uppercase text-muted-foreground">
                      {guess.poll.title}
                    </p>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[guess.result.status]}`}
                    >
                      {guess.result.status}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground">{getGameLabel(guess.game)}</p>
                    <p className="text-xs text-muted-foreground">
                      Enviado em {formatDateTime(guess.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      Palpite {guess.firstTeamPoints} x {guess.secondTeamPoints}
                    </span>
                    <span>-</span>
                    <span>
                      Pontos {guess.result.points !== null ? guess.result.points : "-"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {shouldShowInlineError && (
            <p className="mt-3 text-xs text-destructive">
              Nao foi possivel carregar mais palpites no momento.
            </p>
          )}

          {guesses.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Button
                disabled={(!hasMoreGuesses && !userGuessesQuery.isError) || isLoadingMore}
                onClick={() => {
                  if (isLoadingMore) {
                    return;
                  }

                  if (userGuessesQuery.isError) {
                    void userGuessesQuery.refetch();
                    return;
                  }

                  if (hasMoreGuesses) {
                    setPage((current) => current + 1);
                  }
                }}
                size="sm"
                type="button"
                variant="outline"
              >
                {isLoadingMore
                  ? "Carregando..."
                  : userGuessesQuery.isError
                    ? "Tentar novamente"
                    : hasMoreGuesses
                      ? "Carregar mais"
                      : "Todos carregados"}
              </Button>
            </div>
          )}
        </section>
      </aside>

      {selectedPoll && (
        <PollGuessesModal
          onClose={() => setSelectedPoll(null)}
          poll={selectedPoll}
        />
      )}
    </div>
  );
}
