import { type ComponentProps } from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full rounded-lg border border-copa-border bg-copa-surface px-3 py-2 text-sm text-copa-text placeholder:text-copa-text-muted",
        "transition-colors outline-none",
        "focus:border-copa-accent focus:ring-2 focus:ring-copa-accent/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
