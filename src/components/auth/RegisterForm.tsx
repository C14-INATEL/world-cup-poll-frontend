import { type SyntheticEvent, useState } from "react"
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  function handleSubmit(e: SyntheticEvent) {
    e.preventDefault()
    setError("")

    if (!name || !email || !password || !confirmPassword) return

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    setIsLoading(true)
    // Mock submit - será integrado com backend futuramente
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      {error && (
        <div className="rounded-lg border border-copa-error/30 bg-copa-error/10 px-4 py-3 text-sm text-copa-error">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="register-name" className="text-sm text-copa-text-muted">
          Nome
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-copa-text-muted" />
          <Input
            id="register-name"
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => { setName(e.target.value) }}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="register-email" className="text-sm text-copa-text-muted">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-copa-text-muted" />
          <Input
            id="register-email"
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
        <label htmlFor="register-password" className="text-sm text-copa-text-muted">
          Senha
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-copa-text-muted" />
          <Input
            id="register-password"
            type={showPassword ? "text" : "password"}
            placeholder="Mínimo 6 caracteres"
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

      <div className="space-y-2">
        <label htmlFor="register-confirm" className="text-sm text-copa-text-muted">
          Confirmar Senha
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-copa-text-muted" />
          <Input
            id="register-confirm"
            type={showPassword ? "text" : "password"}
            placeholder="Repita a senha"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value) }}
            className="pl-10"
            required
          />
        </div>
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
            Criando conta...
          </>
        ) : (
          "Criar Conta"
        )}
      </Button>

      <p className="text-center text-sm text-copa-text-muted">
        Já tem uma conta?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-medium text-copa-accent transition-colors hover:text-copa-accent-hover"
        >
          Entrar
        </button>
      </p>
    </form>
  )
}
