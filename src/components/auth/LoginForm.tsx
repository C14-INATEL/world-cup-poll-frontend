import { type SyntheticEvent, useState } from "react"
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { type AuthUser, login } from "@/lib/api"

interface LoginFormProps {
  onSwitchToRegister: () => void
  onLoginSuccess: (user: AuthUser) => void
}

export function LoginForm({ onSwitchToRegister, onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")

    if (!email || !password) return

    setIsLoading(true)
    try {
      const user = await login({ email, password })
      onLoginSuccess(user)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao autenticar usuario"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={(e) => { void handleSubmit(e) }} className="w-full space-y-6">
      {error && (
        <div className="rounded-lg border border-copa-error/30 bg-copa-error/10 px-4 py-3 text-sm text-copa-error">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="login-email" className="text-sm text-copa-text-muted">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-copa-text-muted" />
          <Input
            id="login-email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value) }}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="login-password" className="text-sm text-copa-text-muted">
          Senha
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-copa-text-muted" />
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => { setPassword(e.target.value) }}
            className="pl-10 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => { setShowPassword(!showPassword) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-copa-text-muted transition-colors hover:text-copa-text"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="text-sm text-copa-accent transition-colors hover:text-copa-accent-hover"
        >
          Esqueceu a senha?
        </button>
      </div>

      <Button
        type="submit"
        variant="copa"
        size="copa"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
      </Button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-copa-border" />
        <span className="text-sm text-copa-text-muted">ou</span>
        <div className="h-px flex-1 bg-copa-border" />
      </div>

      <p className="text-center text-sm text-copa-text-muted">
        Não tem uma conta?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="font-medium text-copa-accent transition-colors hover:text-copa-accent-hover"
        >
          Criar conta
        </button>
      </p>
    </form>
  )
}
