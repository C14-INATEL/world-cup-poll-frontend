import { AuthCard } from '@/widgets/auth-card/ui/auth-card'

export function AuthPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-copa-bg p-4">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 size-80 rounded-full bg-copa-accent/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 size-80 rounded-full bg-copa-accent/5 blur-3xl" />
      </div>

      <AuthCard />
    </div>
  )
}
