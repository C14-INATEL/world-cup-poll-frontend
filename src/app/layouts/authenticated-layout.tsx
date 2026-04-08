import { NavLink, useLocation } from "react-router-dom";
import { HouseIcon, LogOut, Trophy } from "lucide-react";

import { useAuth } from "@/app/providers/auth/use-auth";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/ui/sidebar";

const navigationItems = [
  {
    label: "Início",
    icon: HouseIcon,
    to: ROUTES.home,
  },
];

function getUserInitials(name: string) {
  const [firstName = "", secondName = ""] = name.trim().split(" ");
  return `${firstName.charAt(0)}${secondName.charAt(0)}`.toUpperCase() || "U";
}

export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthLoading } = useAuth();
  const { pathname } = useLocation();

  const userInitials = user?.name ? getUserInitials(user.name) : "U";

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg border border-accent bg-accent/20 text-accent">
                <Trophy aria-hidden="true" className="size-4" />
              </div>
              <p className="truncate flex-1 text-start font-semibold leading-tight group-data-[collapsible=icon]:hidden">
                Bolão da Copa
              </p>
            </div>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      isActive={pathname === item.to}
                      render={<NavLink to={item.to} />}
                    >
                      <item.icon aria-hidden="true" />
                      {item.label}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex items-center gap-2 rounded-md border border-sidebar-border p-2 group-data-[collapsible=icon]:hidden">
                <div className="flex size-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                  <span className="text-xs font-semibold">{userInitials}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{user?.name ?? "Usuario"}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user?.email ?? "Sem e-mail"}
                  </p>
                </div>
                <Button
                  aria-label="Sair da conta"
                  disabled={isAuthLoading}
                  onClick={() => {
                    void logout();
                  }}
                  size="icon"
                  type="button"
                  variant="destructive"
                >
                  <LogOut aria-hidden="true" data-icon="inline-start" />
                </Button>
              </div>

              <div className="hidden flex-col items-center gap-2 justify-between group-data-[collapsible=icon]:flex">
                <div className="flex size-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                  <span className="text-xs font-semibold">{userInitials}</span>
                </div>

                <Button
                  aria-label="Sair da conta"
                  disabled={isAuthLoading}
                  onClick={() => {
                    void logout();
                  }}
                  size="icon"
                  type="button"
                  variant="destructive"
                >
                  <LogOut aria-hidden="true" data-icon="inline-start" />
                </Button>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="relative">
        <SidebarTrigger
          className="absolute top-2 left-2 z-20 hidden -translate-x-1/2 border border-border bg-background shadow-sm md:inline-flex"
        />
        <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
