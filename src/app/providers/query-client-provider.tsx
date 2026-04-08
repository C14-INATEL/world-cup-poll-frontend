import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

type QueryProviderProps = {
  children: ReactNode;
  client: QueryClient;
};

export const QueryProvider = ({ client, children }: QueryProviderProps) => {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
