import { useEffect, useMemo, useRef, useState } from "react"

import { Toggle } from "@workspace/ui/components/animate-ui/components/base/toggle"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

import { getComponents, getEstimate, type CategoryRows } from "../api"
import { useHeaderAction } from "../components/Frame"
import { PromptPopover, type StatesMode } from "../components/PromptPopover"
import { Section } from "../components/Section"
import { CountBadge } from "../components/Severity"
import { Glass } from "../components/Glass"
import { ThemeCards } from "../components/ThemeCards"

/** `/qa-run --theme illuzion --states all --components "a,b"`: the whole job, readable and copyable. */
export function buildPrompt(theme: string | null, mode: StatesMode, paths: string[], minutes: number | null) {
  if (!theme || paths.length === 0) return null
  return `/qa-run --theme ${theme} --states ${mode} --components "${paths.join(",")}"${minutes === null ? "" : ` --estimate ${minutes}`}`
}

export function Run() {
  const [categories, setCategories] = useState<CategoryRows[] | null>(null)
  const [offline, setOffline] = useState<string | null>(null)
  const [theme, setTheme] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [mode, setMode] = useState<StatesMode>("defaults")
  const [open, setOpen] = useState(false)
  const runButton = useRef<HTMLButtonElement>(null)
  const [minutes, setMinutes] = useState<number | null>(null)
  const setAction = useHeaderAction()

  useEffect(() => {
    let live = true
    const load = () =>
      getComponents()
        .then((r) => live && (setCategories(r.categories), setOffline(r.offline)))
        .catch((error: Error) => live && setOffline(error.message))
    load()
    // Storybook is the source of truth: the list follows it while the page is open.
    const timer = setInterval(load, 10000)
    return () => {
      live = false
      clearInterval(timer)
    }
  }, [])

  /** Storybook's top-level folders in order, each holding its sub-folders. */
  const sections = useMemo(() => {
    const byTop = new Map<string, CategoryRows[]>()
    for (const c of categories ?? []) {
      const top = c.category.split(" / ")[0]
      byTop.set(top, [...(byTop.get(top) ?? []), c])
    }
    return [...byTop].map(([top, folders]) => ({ top, folders }))
  }, [categories])
  const paths = useMemo(() => (categories ?? []).flatMap((c) => c.components.map((r) => r.path)).filter((p) => selected.has(p)), [categories, selected])

  useEffect(() => {
    if (paths.length === 0) return setMinutes(null)
    let live = true
    getEstimate(paths, mode).then((r) => live && setMinutes(r.minutes)).catch(() => live && setMinutes(null))
    return () => {
      live = false
    }
  }, [paths, mode])

  // a test needs a theme and at least one component
  const canRun = theme !== null && paths.length > 0

  useEffect(() => {
    setAction(
      <Button
        ref={runButton}
        variant="outline"
        data-popover-trigger
        disabled={!canRun}
        onClick={() => setOpen((o) => !o)}
        className="h-12 w-[120px] rounded-[12px] border-white px-6 text-base leading-none"
      >
        Run
      </Button>,
    )
    return () => setAction(null)
  }, [setAction, canRun])

  // the popup closes if the selection is emptied while it is open
  useEffect(() => {
    if (!canRun) setOpen(false)
  }, [canRun])

  const toggle = (...toggled: string[]) =>
    setSelected((current) => {
      const next = new Set(current)
      const everySelected = toggled.every((p) => next.has(p))
      toggled.forEach((p) => (everySelected ? next.delete(p) : next.add(p)))
      return next
    })

  return (
    <div className="flex flex-col gap-4">
      <PromptPopover open={open} onOpenChange={setOpen} anchor={runButton} mode={mode} onMode={setMode} minutes={minutes} prompt={buildPrompt(theme, mode, paths, minutes)} />

      <Section title="Which theme to test on">
        <ThemeCards value={theme} onChange={setTheme} />
      </Section>

      {categories !== null && categories.length === 0 && (
        <Section title="Components">
          <p className="text-base opacity-65">No components yet. Start Storybook and this list fills itself.</p>
        </Section>
      )}
      {sections.map(({ top, folders }, i) => (
        <Section key={top} title={top}>
          {i === 0 && offline && <p className="-mt-4 text-base leading-[1.42] opacity-65">Storybook offline: {offline}. Showing the last list it gave.</p>}
          <div className="grid w-[1120px] grid-cols-3 items-start gap-4">
            {folders.map(({ category, components }) => {
              const all = components.map((c) => c.path)
              const wholeCategory = all.every((p) => selected.has(p))
              return (
                <div
                  key={category}
                  className={cn(
                    "relative isolate flex flex-col gap-8 overflow-clip rounded-2xl bg-gradient-to-b from-white/[0.02] to-white/[0.02] p-6",
                  )}
                >
                  <Glass />
                  {wholeCategory && <div aria-hidden className="pointer-events-none absolute inset-0 z-10 rounded-2xl inset-ring-2 inset-ring-foreground" />}
                  <button type="button" onClick={() => toggle(...all)} className="relative text-left font-heading text-[28px] leading-[1.14] font-extralight">
                    {category.slice(top.length + 3)}
                  </button>
                  <div className="relative flex flex-col gap-3">
                    {components.map((row) => (
                      <Toggle
                        key={row.path}
                        variant="outline"
                        pressed={selected.has(row.path)}
                        onPressedChange={() => toggle(row.path)}
                        className="h-auto w-full justify-between overflow-clip rounded-[8px] border-white/15 p-[11px] text-left text-base leading-[1.42] font-light"
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="truncate">{row.name}</span>
                          <span className="italic opacity-50">{row.stats ? row.stats.total : "—"}</span>
                        </span>
                        {row.excludedReason ? (
                          <span title={row.excludedReason} className="shrink-0 text-sm italic opacity-50">
                            Excluded
                          </span>
                        ) : (
                          row.stats && (
                            <span className="flex shrink-0 items-start gap-1">
                              {row.stats.critical > 0 && <CountBadge label="Cr" count={row.stats.critical} severity="critical" />}
                              {row.stats.major > 0 && <CountBadge label="Ma" count={row.stats.major} severity="major" />}
                              {row.stats.minor > 0 && <CountBadge label="Mi" count={row.stats.minor} severity="minor" />}
                              {row.stats.perfect > 0 && <CountBadge label="Pe" count={row.stats.perfect} severity="perfect" />}
                              {row.stats.untested > 0 && <CountBadge label="👻" count={row.stats.untested} />}
                            </span>
                          )
                        )}
                      </Toggle>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </Section>
      ))}
    </div>
  )
}
