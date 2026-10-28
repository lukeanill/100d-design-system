import { ArrowDownLeftIcon, ArrowUpLeftIcon } from "@phosphor-icons/react"
import { GlassLayer } from "@workspace/ui/components/liquid-glass"
import { useEffect, useState, type CSSProperties, type ReactNode } from "react"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

/**
 * The page every Themer screen sits on: black, with the glow behind the top (and, on some
 * screens, the rings at the bottom). `wide` is the build screen's own layout, the Figma's 1280
 * frame, and it is also plain: that frame draws no background effects. Every other screen keeps
 * the homepage's 1040 column and its glow. Both start below the header bar.
 */
export function Page({
  children,
  glow = "glow",
  rings = false,
  wide = false,
}: {
  children: ReactNode
  glow?: "glow" | "glow-code" | false
  rings?: boolean
  wide?: boolean
}) {
  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-black text-foreground">
      {glow && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[943px] bg-cover bg-top bg-no-repeat"
          style={{ backgroundImage: `url(/themer/${glow}.jpg)` }}
        />
      )}
      {rings && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[505px] bg-cover bg-top bg-no-repeat"
          style={{ backgroundImage: "url(/themer/rings.jpg)" }}
        />
      )}
      {wide ? (
        <div className="mx-auto w-full max-w-[1280px] px-10 pt-[137px] pb-40 max-sm:px-4 max-sm:pt-[105px]">{children}</div>
      ) : (
        // the homepage's column: 1040 wide, held by side padding that grows with the window up to 120
        <div className="w-full px-[clamp(20px,9.375vw,120px)] pt-[137px] pb-40 max-sm:pt-[105px]">
          <div className="mx-auto w-full max-w-[1040px]">{children}</div>
        </div>
      )}
    </div>
  )
}

/**
 * The bar across the top of every screen: Back or Home on the left, whatever
 * the screen has to say in the middle (the build screen's Look / Feel / Values),
 * actions on the right. It stays put, and once the page has scrolled it blurs what passes under it.
 */
export function Header({ nav, center, actions }: { nav: ReactNode; center?: ReactNode; actions?: ReactNode }) {
  // the blur and fill are for when the page has scrolled under the bar; at the top there is nothing to blur
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 0)
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter] duration-200",
        scrolled ? "bg-white/[0.01] backdrop-blur-[20px]" : "bg-transparent backdrop-blur-none"
      )}
    >
      <div className="mx-auto flex min-h-[129px] max-w-[1280px] items-center justify-between gap-6 p-10 max-sm:min-h-[89px] max-sm:gap-3 max-sm:p-4">
        <div className="flex shrink-0">{nav}</div>
        <div className="flex min-w-0 flex-1 items-center justify-center">{center}</div>
        <div className="flex shrink-0 items-center justify-end gap-3">{actions}</div>
      </div>
    </header>
  )
}

/** A screen's title, under the bar. */
export const PageTitle = ({ children }: { children: ReactNode }) => (
  <h2 className="pt-8 pb-[60px] text-center text-[48px] leading-[1.22] max-sm:text-[32px]">{children}</h2>
)

/** The bar's buttons: outlined, 120 by 48, 12 radius. The Figma draws Back 48 and Continue 49; here they are all 48. */
const bar = "h-12 w-[120px] gap-2 rounded-[12px] border-white px-6 text-base leading-none"

export const BackButton = ({ onClick, label = "Back" }: { onClick: () => void; label?: string }) => (
  <Button variant="outline" onClick={onClick} className={cn(bar, "max-sm:w-auto")}>
    <ArrowUpLeftIcon size={24} />
    {label}
  </Button>
)

export const HomeButton = ({ onClick }: { onClick: () => void }) => (
  <Button variant="outline" onClick={onClick} className={cn(bar, "max-sm:w-auto")}>
    <ArrowDownLeftIcon size={24} />
    Home
  </Button>
)

export const ActionButton = ({ children, className, ...props }: React.ComponentProps<typeof Button>) => (
  <Button variant="outline" className={cn(bar, "max-sm:w-auto", className)} {...props}>
    {children}
  </Button>
)

/** A glass panel with the thin edge the Figma draws around every section. */
export function Panel({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <section className={cn("relative isolate rounded-2xl border border-white/10", className)} style={style}>
      <GlassLayer
        weight="soft"
        tint="linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))"
        radius={16}
      />
      <div className="relative">{children}</div>
    </section>
  )
}
