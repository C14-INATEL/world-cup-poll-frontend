import { NavLink } from "react-router-dom";
import { LogOut, Trophy } from "lucide-react";

import { useAuth } from "@/app/providers/auth/use-auth";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/utils/cn";

const navigationItems = [
  {
    label: "Início",
    to: ROUTES.home,
  },
];

function getUserInitials(name: string) {
  const [firstName = "", secondName = ""] = name.trim().split(" ");
  return `${firstName.charAt(0)}${secondName.charAt(0)}`.toUpperCase() || "U";
}

export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthLoading } = useAuth();

  const userInitials = user?.name ? getUserInitials(user.name) : "U";

  return (
    <div className="min-h-dvh bg-background">
      <div className="flex min-h-dvh w-full max-w-360 flex-col md:grid md:grid-cols-[240px_1fr]">
        <aside className="border-b border-border px-2 py-6 md:border-r md:border-b-0 md:px-4">
          <div className="flex h-full flex-col gap-8">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-accent/20 text-accent">
                <Trophy aria-hidden="true" className="size-6" />
              </div>
              <p className="font-semibold">Bolão da Copa</p>
            </div>

            <nav aria-label="Navegacao principal" className="flex flex-col gap-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.to}
                  className={({ isActive }) =>
                    cn(
                      "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
                      isActive && "bg-primary/20 text-primary",
                    )
                  }
                  to={item.to}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto flex items-center gap-3 rounded-xl border border-border p-3">
              <div className="flex size-6 md:size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="text-sm font-semibold">{userInitials}</span>
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium text-foreground">
                  {user?.name ?? "Usuario"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.email ?? "Sem e-mail"}
                </span>
              </div>

              <Button
                aria-label="Sair da conta"
                title="Sair da conta"
                disabled={isAuthLoading}
                onClick={() => {
                  void logout();
                }}
                size="icon"
                type="button"
                variant="destructive"
              >
                <LogOut aria-hidden="true" />
              </Button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
