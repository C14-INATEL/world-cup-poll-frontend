import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "@/app/providers/auth/use-auth";
import { ROUTES } from "@/shared/constants/routes";
import { DividedLayout } from "@/shared/ui/layouts/divided-layout";
import { Input } from "@/shared/ui/input";
import { Lock, Mail, Trophy, User } from "lucide-react";
import { Button } from "@/shared/ui/button";

const loginFormSchema = z.object({
  email: z.email("Formato de e-mail inválido").min(1, "O e-mail e obrigatório"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

const registerFormSchema = z
  .object({
    name: z.string().min(1, "O nome e obrigatório"),
    email: z.email("Formato de e-mail inválido").min(1, "O e-mail e obrigatório"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirme sua senha"),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "As senhas nao coincidem",
    path: ["confirmPassword"],
  });

interface LoginFormData extends z.infer<typeof loginFormSchema> {}
interface RegisterFormData extends z.infer<typeof registerFormSchema> {}

function toErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Nao foi possível concluir a autenticação";
}

export function AuthPage() {
  const { login, register: registerUser, isAuthLoading } = useAuth();
  const navigate = useNavigate();

  const [view, setView] = useState<"login" | "register">("login");

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onLoginSubmit(data: LoginFormData) {
    try {
      await login(data);
      navigate(ROUTES.home);
    } catch (error) {
      loginForm.setError("root", { message: toErrorMessage(error) });
    }
  }

  async function onRegisterSubmit(data: RegisterFormData) {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      navigate(ROUTES.home);
    } catch (error) {
      registerForm.setError("root", { message: toErrorMessage(error) });
    }
  }

  return (
    <DividedLayout
      leftContent={
        <div className="relative h-full w-full bg-[url(/login-image.jpg)] bg-cover bg-center bg-no-repeat">
          <div className="absolute inset-0 bg-foreground/50" />
        </div>
      }
    >
      <form
        className="h-full max-w-md m-auto -mt-4 flex flex-col gap-4 px-4 md:px-8 justify-center"
        onSubmit={
          view === "login"
            ? loginForm.handleSubmit(onLoginSubmit)
            : registerForm.handleSubmit(onRegisterSubmit)
        }
      >
        <div className="flex flex-col gap-2 items-center text-center">
          <Trophy className="size-12 text-accent" />
          <h2 className="text-3xl font-semibold">Bolão da Copa 2026</h2>
          <p className="text-zinc-500">
            {view === "login"
              ? "Entre na sua conta para fazer seus palpites"
              : "Crie sua conta e participe do bolão"}
          </p>
        </div>

        {view === "register" && (
          <div className="flex flex-col gap-1">
            <div className="space-y-2">
              <label htmlFor="register-name" className="text-sm">
                Nome
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                <Input
                  id="register-name"
                  type="text"
                  placeholder="Seu nome"
                  className="pl-10"
                  {...registerForm.register("name")}
                />
              </div>
            </div>

            {registerForm.formState.errors.name && (
              <span className="text-destructive text-sm">
                {registerForm.formState.errors.name.message}
              </span>
            )}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <div className="space-y-2">
            <label htmlFor="auth-email" className="text-sm">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                id="auth-email"
                type="email"
                placeholder="seuemail@email.com"
                className="pl-10"
                {...(view === "login"
                  ? loginForm.register("email")
                  : registerForm.register("email"))}
              />
            </div>
          </div>

          {view === "login" && loginForm.formState.errors.email && (
            <span className="text-destructive text-sm">
              {loginForm.formState.errors.email.message}
            </span>
          )}

          {view === "register" && registerForm.formState.errors.email && (
            <span className="text-destructive text-sm">
              {registerForm.formState.errors.email.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="space-y-2">
            <label htmlFor="auth-password" className="text-sm">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                id="auth-password"
                type="password"
                className="pl-10"
                {...(view === "login"
                  ? loginForm.register("password")
                  : registerForm.register("password"))}
              />
            </div>
          </div>

          {view === "login" && loginForm.formState.errors.password && (
            <span className="text-destructive text-sm">
              {loginForm.formState.errors.password.message}
            </span>
          )}

          {view === "register" && registerForm.formState.errors.password && (
            <span className="text-destructive text-sm">
              {registerForm.formState.errors.password.message}
            </span>
          )}
        </div>

        {view === "register" && (
          <div className="flex flex-col gap-1">
            <div className="space-y-2">
              <label htmlFor="register-confirm-password" className="text-sm">
                Confirmar senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                <Input
                  id="register-confirm-password"
                  type="password"
                  className="pl-10"
                  {...registerForm.register("confirmPassword")}
                />
              </div>
            </div>

            {registerForm.formState.errors.confirmPassword && (
              <span className="text-destructive text-sm">
                {registerForm.formState.errors.confirmPassword.message}
              </span>
            )}
          </div>
        )}

        <Button type="submit" disabled={isAuthLoading}>
          {view === "login" ? "Fazer login" : "Criar conta"}
        </Button>

        <p className="text-center text-sm">
          {view === "login" ? "Não tem conta?" : "Já tem conta?"}
          <Button
            type="button"
            variant="link"
            onClick={() => {
              setView((currentView) => (currentView === "login" ? "register" : "login"));
              loginForm.reset();
              registerForm.reset();
            }}
          >
            {view === "login" ? "Crie agora" : "Entrar"}
          </Button>
        </p>
      </form>
    </DividedLayout>
  );
}
