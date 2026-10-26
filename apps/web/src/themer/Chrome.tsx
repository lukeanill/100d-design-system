import { ArrowDownLeftIcon, ArrowUpLeftIcon } from "@phosphor-icons/react"
import type { CSSProperties, ReactNode } from "react"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

/** The page every Themer screen sits on: black, with the Figma's glow behind the top. */
export function Page({ children, glow = "glow", rings = false }: { children: ReactNode; glow?: "glow" | "glow-code"; rings?: boolean }) {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-black text-foreground">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[943px] bg-cover bg-top bg-no-repeat"
        style={{ backgroundImage: `url(/themer/${glow}.jpg)` }}
      />
      {rings && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[505px] bg-cover bg-top bg-no-repeat"
          style={{ backgroundImage: "url(/themer/rings.jpg)" }}
        />
      )}
      <div className="mx-auto w-full max-w-[1280px] px-6 pb-40 sm:px-[120px]">{children}</div>
    </div>
  )
}

/** Back or Home on the left, the title in the middle, actions on the right. */
export function Header({ nav, title, actions }: { nav: ReactNode; title: ReactNode; actions?: ReactNode }) {
  return (
    <header className="grid grid-cols-[auto_1fr_auto] items-center sm:grid-cols-[1fr_auto_1fr] gap-4 pt-[120px] pb-[80px] max-sm:pt-16 max-sm:pb-10">
      <div className="flex">{nav}</div>
      <div className="text-center">{title}</div>
      <div className="flex items-center justify-end gap-3">{actions}</div>
    </header>
  )
}

export const PageTitle = ({ children }: { children: ReactNode }) => (
  <h2 className="text-[48px] leading-[1.22] max-sm:text-[32px]">{children}</h2>
)

const nav = "h-[52px] gap-2 px-6 text-sm"

export const BackButton = ({ onClick, label = "Back" }: { onClick: () => void; label?: string }) => (
  <Button variant="outline" onClick={onClick} className={nav}>
    <ArrowUpLeftIcon size={16} />
    {label}
  </Button>
)

export const HomeButton = ({ onClick }: { onClick: () => void }) => (
  <Button variant="outline" onClick={onClick} className={nav}>
    <ArrowDownLeftIcon size={16} />
    Home
  </Button>
)

export const ActionButton = ({ children, className, ...props }: React.ComponentProps<typeof Button>) => (
  <Button variant="outline" className={cn("h-[46px] px-6 text-sm", className)} {...props}>
    {children}
  </Button>
)

/** A glass panel with the thin edge the Figma draws around every section. */
export function Panel({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <section
      className={cn("rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-white/[0.06] backdrop-blur-xl", className)}
      style={style}
    >
      {children}
    </section>
  )
}
