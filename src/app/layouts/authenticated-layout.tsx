import { Menu } from "@base-ui/react/menu";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Bell, Check, CircleUserRound, HouseIcon, LogOut, Target, Trophy, X } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/app/providers/auth/use-auth";
import { useUserInvitesQuery } from "@/entities/invite";
import { useRespondInviteMutation } from "@/features/invite";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/utils/cn";

const navigationItems = [
  {
    label: "Inicio",
    icon: HouseIcon,
    to: ROUTES.home,
  },
  {
    label: "Palpites",
    icon: Target,
    to: ROUTES.guesses,
  },
];

function getUserInitials(name: string) {
  const [firstName = "", secondName = ""] = name.trim().split(" ");
  return `${firstName.charAt(0)}${secondName.charAt(0)}`.toUpperCase() || "U";
}

export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthLoading } = useAuth();
  const { pathname } = useLocation();

  const { data: invites = [], ...invitesQuery } = useUserInvitesQuery(Boolean(user));
  const respondInviteMutation = useRespondInviteMutation();

  const userInitials = user?.name ? getUserInitials(user.name) : "U";
  const activeInvites = invites.filter((invite) => invite.status === "pending");
  const hasInvites = activeInvites.length > 0;

  const handleInviteResponse = async (inviteId: string, status: "accepted" | "declined") => {
    await respondInviteMutation.mutateAsync({ id: inviteId, status });
    toast.success(status === "accepted" ? "Convite aceito!" : "Convite recusado.");
  };

  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 md:min-h-16 md:flex-row md:items-center md:justify-between md:gap-4 md:px-8 md:py-0">
          <Link
            to={ROUTES.home}
            className="flex min-w-0 items-center gap-3 text-foreground transition-opacity hover:opacity-80"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-accent bg-accent/20 text-accent">
              <Trophy aria-hidden="true" className="size-4" />
            </div>
            <span className="truncate text-base font-semibold leading-tight">Bolao da Copa</span>
          </Link>

          <nav
            aria-label="Opcoes"
            className="flex min-w-0 flex-1 items-center gap-2 md:justify-center"
          >
            <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto rounded-lg p-1 md:flex-none">
              {navigationItems.map((item) => {
                const isActive = pathname === item.to;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
                      isActive && " text-foreground ",
                    )}
                  >
                    <item.icon aria-hidden="true" className="size-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </nav>

          <div className="flex items-center justify-between gap-2 md:justify-end">
            <Menu.Root>
              <Menu.Trigger
                aria-label={
                  hasInvites
                    ? `Notificacoes: ${activeInvites.length} convite pendente`
                    : "Notificacoes"
                }
                className="relative inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-expanded:bg-muted"
              >
                <Bell aria-hidden="true" className="size-4" />
                {hasInvites && (
                  <span className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[0.625rem] font-semibold leading-none text-white">
                    {activeInvites.length}
                  </span>
                )}
              </Menu.Trigger>
              <Menu.Portal>
                <Menu.Positioner align="end" side="bottom" sideOffset={8} className="z-50">
                  <Menu.Popup className="w-[min(calc(100vw-2rem),24rem)] origin-(--transform-origin) rounded-lg border border-border bg-popover p-1 text-sm text-popover-foreground shadow-lg outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
                    <div className="px-3 py-2">
                      <p className="font-medium">Notificacoes</p>
                      <p className="text-xs text-muted-foreground">Convites de grupos recebidos.</p>
                    </div>
                    <Menu.Separator className="my-1 h-px bg-border" />

                    {invitesQuery.isPending && (
                      <div className="px-3 py-4 text-sm text-muted-foreground">
                        Carregando convites...
                      </div>
                    )}

                    {invitesQuery.isError && (
                      <div className="px-3 py-4 text-sm text-destructive">
                        Não foi possivel carregar as notificações.
                      </div>
                    )}

                    {!invitesQuery.isPending && !invitesQuery.isError && !hasInvites && (
                      <div className="px-3 py-4 text-sm text-muted-foreground">
                        Nenhum convite pendente.
                      </div>
                    )}

                    {activeInvites.map((invite) => (
                      <article
                        key={invite.id}
                        className="flex flex-col gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-muted/60"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            {invite.pollTitle ?? "Grupo convidado"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {invite.invitedByName
                              ? `${invite.invitedByName} convidou voce para participar.`
                              : "Voce recebeu um convite para participar."}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            type="button"
                            disabled={respondInviteMutation.isPending}
                            onClick={() => void handleInviteResponse(invite.id, "accepted")}
                          >
                            <Check aria-hidden="true" className="size-3.5" />
                            Aceitar
                          </Button>
                          <Button
                            size="sm"
                            type="button"
                            variant="outline"
                            disabled={respondInviteMutation.isPending}
                            onClick={() => void handleInviteResponse(invite.id, "declined")}
                          >
                            <X aria-hidden="true" className="size-3.5" />
                            Recusar
                          </Button>
                        </div>
                      </article>
                    ))}
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>

            <Menu.Root>
              <Menu.Trigger
                aria-label="Abrir menu do perfil"
                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="text-xs font-semibold">{userInitials}</span>
              </Menu.Trigger>
              <Menu.Portal>
                <Menu.Positioner align="end" side="bottom" sideOffset={8} className="z-50">
                  <Menu.Popup className="min-w-56 origin-(--transform-origin) rounded-lg border border-border bg-popover p-1 text-sm text-popover-foreground shadow-lg outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
                    <div className="px-3 py-2">
                      <p className="truncate font-medium">{user?.name ?? "Usuario"}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user?.email ?? "Sem e-mail"}
                      </p>
                    </div>
                    <Menu.Separator className="my-1 h-px bg-border" />
                    <Menu.LinkItem
                      closeOnClick
                      render={<Link to={ROUTES.profile} />}
                      className="flex h-9 cursor-pointer items-center gap-2 rounded-md px-2.5 text-foreground outline-none transition-colors hover:bg-muted data-highlighted:bg-muted"
                    >
                      <CircleUserRound aria-hidden="true" className="size-4" />
                      <span>Perfil</span>
                    </Menu.LinkItem>
                    <Menu.Item
                      disabled={isAuthLoading}
                      onClick={() => {
                        void logout();
                      }}
                      className="flex h-9 cursor-pointer items-center gap-2 rounded-md px-2.5 text-destructive outline-none transition-colors hover:bg-destructive/10 data-highlighted:bg-destructive/10 data-disabled:pointer-events-none data-disabled:opacity-50"
                    >
                      <LogOut aria-hidden="true" className="size-4" />
                      <span>Sair</span>
                    </Menu.Item>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
          </div>
        </div>
      </header>

      <main className="mx-auto min-w-0 max-w-7xl flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}

