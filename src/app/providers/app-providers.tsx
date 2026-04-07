import { BrowserRouter } from "react-router-dom";
import { type PropsWithChildren } from "react";

import { QueryProvider } from "@/app/providers/query-client-provider";
import { queryClient } from "@/shared/api/query-client";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryProvider>
  );
}
