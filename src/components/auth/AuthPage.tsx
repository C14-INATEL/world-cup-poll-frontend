import { useState } from "react"
import { Trophy } from "lucide-react"
import { LoginForm } from "./LoginForm"
import { RegisterForm } from "./RegisterForm"
import { type AuthUser } from "@/lib/api"

type AuthView = "login" | "register"

export function AuthPage() {
  const [view, setView] = useState<AuthView>("login")
  const [loggedUser, setLoggedUser] = useState<AuthUser | null>(null)

  if (loggedUser) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-copa-bg p-4">
        <div className="w-full max-w-md rounded-2xl border border-copa-border bg-copa-surface p-8 text-center shadow-2xl shadow-black/20">
          <h1 className="text-2xl font-bold text-copa-text">Login realizado</h1>
          <p className="mt-3 text-copa-text-muted">
            Bem-vindo, <span className="font-semibold text-copa-text">{loggedUser.name}</span>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-copa-bg p-4">
      {/* Background decorativo */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 size-80 rounded-full bg-copa-accent/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 size-80 rounded-full bg-copa-accent/5 blur-3xl" />
      </div>

      {/* Card principal */}
      <div className="relative w-full max-w-md rounded-2xl border border-copa-border bg-copa-surface p-8 shadow-2xl shadow-black/20">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-xl bg-copa-accent/10">
            <Trophy className="size-7 text-copa-accent" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-copa-text">
              Bolão da Copa
            </h1>
            <p className="mt-1 text-sm text-copa-text-muted">
              {view === "login"
                ? "Entre na sua conta para fazer seus palpites"
                : "Crie sua conta e participe do bolão"}
            </p>
          </div>
        </div>

        {/* Formulários */}
        {view === "login" ? (
          <LoginForm
            onSwitchToRegister={() => { setView("register") }}
            onLoginSuccess={(user) => { setLoggedUser(user) }}
          />
        ) : (
          <RegisterForm
            onSwitchToLogin={() => { setView("login") }}
            onRegisterSuccess={(user) => { setLoggedUser(user) }}
          />
        )}
      </div>
    </div>
  )
}
