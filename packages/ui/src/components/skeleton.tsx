import { cn } from "@workspace/ui/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden rounded-xl bg-foreground/10",
        "after:absolute after:inset-0 after:-translate-x-full after:animate-[skeleton-sweep_1.6s_ease-in-out_infinite] after:bg-linear-to-r after:from-transparent after:via-foreground/15 after:to-transparent",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
