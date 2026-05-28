import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { AuthPage } from "@/pages/auth";
import { ROUTES } from "@/shared/constants/routes";
import { ENDPOINTS } from "@/shared/constants/endpoints";
import { server } from "@/test/mocks/server";
import { http, HttpResponse } from "msw";
import { renderWithProviders } from "@/test/setup/render-with-providers";
import { PrivateRoute } from "@/app/routes/private-route";
import { HomePage } from "../home";
import { apiBaseUrl } from "@/shared/api/api";

const authenticatedSession = {
  id: "user-1",
  name: "Ana Clara",
  email: "ana@example.com",
  token: "token-123",
};

describe("AuthPage", () => {
  it("logs in and redirects to home", async () => {
    const user = userEvent.setup();

    server.use(
      http.post(apiBaseUrl + ENDPOINTS.auth.login, () => HttpResponse.json(authenticatedSession)),
    );

    renderWithProviders(
      <Routes>
        <Route path={ROUTES.auth} element={<AuthPage />} />
        <Route path={ROUTES.home} element={<div>Home</div>} />
      </Routes>,
      { initialEntries: [ROUTES.auth] },
    );

    await user.type(screen.getByLabelText(/e-mail/i), "ana@example.com");
    await user.type(screen.getByLabelText(/^senha$/i), "123456");
    await user.click(screen.getByRole("button", { name: /fazer login/i }));

    await waitFor(() => {
      expect(screen.getByText("Home")).toBeInTheDocument();
    });
  });

  it("registers and redirects to home", async () => {
    const user = userEvent.setup();

    server.use(
      http.post(apiBaseUrl + ENDPOINTS.auth.register, () =>
        HttpResponse.json(authenticatedSession),
      ),
    );

    renderWithProviders(
      <Routes>
        <Route path={ROUTES.auth} element={<AuthPage />} />
        <Route path={ROUTES.home} element={<div>Home</div>} />
      </Routes>,
      { initialEntries: [ROUTES.auth] },
    );

    await user.click(screen.getByRole("button", { name: /crie agora/i }));

    await user.type(screen.getByLabelText(/nome/i), "Ana Clara");
    await user.type(screen.getByLabelText(/e-mail/i), "ana@example.com");
    await user.type(screen.getByLabelText(/^senha$/i), "123456");
    await user.type(screen.getByLabelText(/confirmar senha/i), "123456");
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    await waitFor(() => {
      expect(screen.getByText("Home")).toBeInTheDocument();
    });
  });

  it("redireciona para /login se não autenticado", async () => {
    server.use(
      http.get(apiBaseUrl + ENDPOINTS.auth.me, () => HttpResponse.json(null, { status: 401 })),
    );

    renderWithProviders(
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path={ROUTES.home} element={<HomePage />} />
        </Route>
        <Route path={ROUTES.auth} element={<AuthPage />} />
      </Routes>,
      { initialEntries: [ROUTES.home] },
    );

    await waitFor(() => {
      expect(screen.getByText("Bolão da Copa 2026")).toBeInTheDocument();
    });
  });
});
