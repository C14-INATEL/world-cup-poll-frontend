import { useState } from 'react'
import { Eye, EyeOff, Loader2, Lock, Mail, Trophy, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { type SyntheticEvent } from 'react'

import { useLoginMutation } from '@/features/auth/login/api/use-login-mutation'
import { useRegisterMutation } from '@/features/auth/register/api/use-register-mutation'
import { ROUTES } from '@/shared/constants/routes'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'

type AuthView = 'login' | 'register'

export function AuthCard() {
  const [view, set_view] = useState<AuthView>('login')
  const [show_password, set_show_password] = useState(false)

  const [name, set_name] = useState('')
  const [email, set_email] = useState('')
  const [password, set_password] = useState('')
  const [confirm_password, set_confirm_password] = useState('')
  const [validation_error, set_validation_error] = useState('')

  const navigate = useNavigate()

  const login_mutation = useLoginMutation()
  const register_mutation = useRegisterMutation()

  const is_loading = login_mutation.isPending || register_mutation.isPending
  const mutation_error = login_mutation.error ?? register_mutation.error

  function clear_form_state() {
    set_name('')
    set_email('')
    set_password('')
    set_confirm_password('')
    set_validation_error('')
    set_show_password(false)
  }

  async function handle_login_submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    set_validation_error('')

    if (!email || !password) {
      set_validation_error('Preencha email e senha.')
      return
    }

    await login_mutation.mutateAsync(
      { email, password },
      {
        onSuccess: () => {
          void navigate(ROUTES.home)
        },
      },
    )
  }

  async function handle_register_submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    set_validation_error('')

    if (!name || !email || !password || !confirm_password) {
      set_validation_error('Preencha todos os campos.')
      return
    }

    if (password !== confirm_password) {
      set_validation_error('As senhas nao coincidem.')
      return
    }

    if (password.length < 6) {
      set_validation_error('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    await register_mutation.mutateAsync(
      { name, email, password },
      {
        onSuccess: () => {
          void navigate(ROUTES.home)
        },
      },
    )
  }

  function error_message() {
    if (validation_error) {
      return validation_error
    }

    if (mutation_error instanceof Error) {
      return mutation_error.message
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

      {error_message() && (
        <div className="mb-5 rounded-lg border border-copa-error/30 bg-copa-error/10 px-4 py-3 text-sm text-copa-error">
          {error_message()}
        </div>
      )}

      {view === 'login' ? (
        <form
          onSubmit={(event) => {
            void handle_login_submit(event)
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
                  set_email(event.target.value)
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
                type={show_password ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(event) => {
                  set_password(event.target.value)
                }}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => {
                  set_show_password((state) => !state)
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-copa-text-muted transition-colors hover:text-copa-text"
              >
                {show_password ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" variant="copa" size="copa" className="w-full" disabled={is_loading}>
            {is_loading ? (
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
                clear_form_state()
                set_view('register')
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
            void handle_register_submit(event)
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
                  set_name(event.target.value)
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
                  set_email(event.target.value)
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
                type={show_password ? 'text' : 'password'}
                placeholder="Minimo 6 caracteres"
                value={password}
                onChange={(event) => {
                  set_password(event.target.value)
                }}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => {
                  set_show_password((state) => !state)
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-copa-text-muted transition-colors hover:text-copa-text"
              >
                {show_password ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
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
                type={show_password ? 'text' : 'password'}
                placeholder="Repita a senha"
                value={confirm_password}
                onChange={(event) => {
                  set_confirm_password(event.target.value)
                }}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" variant="copa" size="copa" className="w-full" disabled={is_loading}>
            {is_loading ? (
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
                clear_form_state()
                set_view('login')
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
