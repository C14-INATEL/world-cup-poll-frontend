import { BrowserRouter } from "react-router-dom";
import { type PropsWithChildren } from "react";

import { AuthProvider } from "@/app/providers/auth/auth-provider";
import { QueryProvider } from "@/app/providers/query-client-provider";
import { queryClient } from "@/shared/api/query-client";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </AuthProvider>
    </QueryProvider>
  );
}
