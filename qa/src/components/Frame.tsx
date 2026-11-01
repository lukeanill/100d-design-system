import { ArrowUpLeftIcon } from "@phosphor-icons/react"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { NavLink, Outlet } from "react-router"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

import { getComponents } from "../api"

/** What a page puts in the header's right-hand slot: Run's "Run" button, later the Fix Issues button. */
const ActionSlot = createContext<(node: ReactNode) => void>(() => {})
export const useHeaderAction = () => useContext(ActionSlot)

const TABS = [
  { to: "/run", label: "Run" },
  { to: "/results", label: "Results" },
]

/** The Figma's 1280 frame: header, then the page. Desktop only; nothing here reflows. */
export function Frame() {
  const [action, setAction] = useState<ReactNode>(null)
  const [storybookUrl, setStorybookUrl] = useState("http://localhost:6006")
  // same as the Themer's bar: clear at the top, a faint fill and blur once the page scrolls under it
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 0)
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  useEffect(() => {
    getComponents()
      .then((r) => setStorybookUrl(r.storybookUrl))
      .catch(() => {})
  }, [])

  return (
    <div className="relative mx-auto min-h-screen w-[1280px] bg-background text-foreground">
      <header
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter] duration-200",
          scrolled ? "bg-white/[0.01] backdrop-blur-[20px]" : "bg-transparent backdrop-blur-none",
        )}
      >
        <div className="mx-auto flex min-h-[129px] w-[1280px] items-center justify-between p-10">
          <Button variant="outline" render={<a href={storybookUrl} />} className="pointer-events-auto h-12 gap-2 rounded-[12px] border-white px-6 text-base leading-none">
            <ArrowUpLeftIcon size={24} />
            Storybook
          </Button>
          <nav className="flex flex-1 items-center justify-center gap-6 text-base leading-[1.42] font-light">
            {TABS.map((tab) => (
              <NavLink key={tab.to} to={tab.to} className={({ isActive }) => cn("pointer-events-auto", !isActive && "opacity-50")}>
                {tab.label}
              </NavLink>
            ))}
          </nav>
          <div className="pointer-events-auto flex h-[49px] w-[120px] justify-end">{action}</div>
        </div>
      </header>
      <ActionSlot.Provider value={setAction}>
        <main className="px-20 pt-[137px] pb-20">
          <Outlet />
        </main>
      </ActionSlot.Provider>
    </div>
  )
}
