import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, RotateCcw, Save, Target, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { type GuessResultStatus, type UserGuess, useUserGuessesQuery } from "@/entities/guess";
import { type User } from "@/entities/user/types";
import { useCurrentUserQuery } from "@/entities/user/use-current-user-query";
import { useUpdateProfileMutation } from "@/features/user/edit-profile/use-update-profile-mutation";
import { Button } from "@/shared/ui/button";
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

      {form.formState.errors.root && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {form.formState.errors.root.message}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
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

export function ProfilePage() {
  const userQuery = useCurrentUserQuery();
  const user = userQuery.data;

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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 xl:flex-row">
      <div className="flex w-full flex-col gap-6 xl:flex-1">
        <header className="rounded-lg border border-border bg-card p-4 md:p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
              <UserRound aria-hidden="true" className="size-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-card-foreground">Editar perfil</h1>
              <p className="text-sm text-muted-foreground">
                Mantenha seus dados atualizados para identificar seus palpites e grupos.
              </p>
            </div>
          </div>
        </header>

        <section className="rounded-lg border border-border bg-card p-4 md:p-5">
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
      </div>

      <aside className="w-full xl:w-[360px] xl:shrink-0">
        <section className="rounded-lg border border-border bg-card p-4 md:p-5 xl:sticky xl:top-6">
          <div className="flex items-center gap-2">
            <Target className="text-muted-foreground" />
            <div>
              <h2 className="text-base font-semibold text-card-foreground">Todos os palpites</h2>
              <p className="text-xs text-muted-foreground">
                Todos os seus palpites nos boloes que participa.
              </p>
            </div>
          </div>

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
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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
                    <span>•</span>
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
    </div>
  );
}
