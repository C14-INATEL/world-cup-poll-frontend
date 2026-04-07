import { useState } from 'react'
import { Eye, EyeOff, Loader2, Lock, Mail, Trophy, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { type SyntheticEvent } from 'react'

import { useLoginMutation } from '@/features/auth/login/use-login-mutation'
import { useRegisterMutation } from '@/features/auth/register/use-register-mutation'
import { ROUTES } from '@/shared/constants/routes'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'

type AuthView = 'login' | 'register'

export function AuthCard() {
  const [view, setView] = useState<AuthView>('login')
  const [showPassword, setShowPassword] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validationError, setValidationError] = useState('')

  const navigate = useNavigate()

  const loginMutation = useLoginMutation()
  const registerMutation = useRegisterMutation()

  const isLoading = loginMutation.isPending || registerMutation.isPending
  const mutationError = loginMutation.error ?? registerMutation.error

  function clearFormState() {
    setName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setValidationError('')
    setShowPassword(false)
  }

  async function handleLoginSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    setValidationError('')

    if (!email || !password) {
      setValidationError('Preencha email e senha.')
      return
    }

    await loginMutation.mutateAsync(
      { email, password },
      {
        onSuccess: () => {
          void navigate(ROUTES.home)
        },
      },
    )
  }

  async function handleRegisterSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    setValidationError('')

    if (!name || !email || !password || !confirmPassword) {
      setValidationError('Preencha todos os campos.')
      return
    }

    if (password !== confirmPassword) {
      setValidationError('As senhas nao coincidem.')
      return
    }

    if (password.length < 6) {
      setValidationError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    await registerMutation.mutateAsync(
      { name, email, password },
      {
        onSuccess: () => {
          void navigate(ROUTES.home)
        },
      },
    )
  }

  function errorMessage() {
    if (validationError) {
      return validationError
    }

    if (mutationError instanceof Error) {
      return mutationError.message
    }

    return ''
  }

  return (
    <div className="relative w-full max-w-md rounded-2xl border border-copa-border bg-copa-surface p-8 shadow-2xl shadow-black/20">
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex size-14 items-center justify-center rounded-xl bg-copa-accent/10">
          <Trophy className="size-7 text-copa-accent" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-copa-text">Bolao da Copa</h1>
          <p className="mt-1 text-sm text-copa-text-muted">
            {view === 'login'
              ? 'Entre na sua conta para fazer seus palpites'
              : 'Crie sua conta e participe do bolao'}
          </p>
        </div>
      </div>

      {errorMessage() && (
        <div className="mb-5 rounded-lg border border-copa-error/30 bg-copa-error/10 px-4 py-3 text-sm text-copa-error">
          {errorMessage()}
        </div>
      )}

      {view === 'login' ? (
        <form
          onSubmit={(event) => {
            void handleLoginSubmit(event)
          }}
          className="w-full space-y-6"
        >
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
                onChange={(event) => {
                  setEmail(event.target.value)
                }}
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
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                }}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => {
                  setShowPassword((state) => !state)
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-copa-text-muted transition-colors hover:text-copa-text"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>

          <p className="text-center text-sm text-copa-text-muted">
            Nao tem uma conta?{' '}
            <button
              type="button"
              onClick={() => {
                clearFormState()
                setView('register')
              }}
              className="font-medium text-copa-accent transition-colors hover:text-copa-accent-hover"
            >
              Criar conta
            </button>
          </p>
        </form>
      ) : (
        <form
          onSubmit={(event) => {
            void handleRegisterSubmit(event)
          }}
          className="w-full space-y-5"
        >
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
                onChange={(event) => {
                  setName(event.target.value)
                }}
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
                onChange={(event) => {
                  setEmail(event.target.value)
                }}
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
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimo 6 caracteres"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                }}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => {
                  setShowPassword((state) => !state)
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-copa-text-muted transition-colors hover:text-copa-text"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="register-confirm" className="text-sm text-copa-text-muted">
              Confirmar senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-copa-text-muted" />
              <Input
                id="register-confirm"
                type={showPassword ? 'text' : 'password'}
                placeholder="Repita a senha"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value)
                }}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Criando conta...
              </>
            ) : (
              'Criar conta'
            )}
          </Button>

          <p className="text-center text-sm text-copa-text-muted">
            Ja tem uma conta?{' '}
            <button
              type="button"
              onClick={() => {
                clearFormState()
                setView('login')
              }}
              className="font-medium text-copa-accent transition-colors hover:text-copa-accent-hover"
            >
              Entrar
            </button>
          </p>
        </form>
      )}
    </div>
  )
}
