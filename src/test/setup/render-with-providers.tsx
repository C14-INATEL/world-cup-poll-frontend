import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { User } from "@/entities/user/types";
import { AuthProvider } from "@/app/providers/auth/auth-provider";

function makeTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
    },
  });
}

type Options = {
  initialEntries?: string[];
  initialUser?: User | null;
  queryClient?: QueryClient;
};

export function renderWithProviders(ui: React.ReactElement, options: Options = {}) {
  const { initialEntries = ["/"], queryClient = makeTestQueryClient() } = options;

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          <AuthProvider>{children}</AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );
  }

  return { ...render(ui, { wrapper: Wrapper }), queryClient };
}
