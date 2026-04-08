import { BrowserRouter } from "react-router-dom";
import { type PropsWithChildren } from "react";

import { AuthProvider } from "@/app/providers/auth/auth-provider";
import { QueryProvider } from "@/app/providers/query-client-provider";
import { queryClient } from "@/shared/api/query-client";
import { TooltipProvider } from "@/shared/ui/tooltip";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <TooltipProvider>{children}</TooltipProvider>
        </BrowserRouter>
      </AuthProvider>
    </QueryProvider>
  );
}
