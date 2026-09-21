import { useState } from "react"
import { DotsSixVerticalIcon, PencilSimpleIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import type { Theme } from "./api"
import { useGoogleFont } from "./useGoogleFont"

/** The two-letter code the row shows for its base size. */
const EDGE_CODE: Record<string, string> = {
  square: "Sq",
  subtle: "Su",
  strong: "St",
  round: "Ro",
}

const formatDate = (iso?: string) => {
  if (!iso) return null
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? null
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

/**
 * The swatches, overlapping left to right: background, foreground, card,
 * primary, secondary.
 *
 * Every circle carries a hairline. Without one, `background` disappears
 * entirely — the row is painted in that same colour, so the circle would be an
 * invisible hole rather than a swatch. The border is drawn in the row's own
 * foreground at low alpha so it works on a light row and a dark one alike.
 */
function Swatches({ colors }: { colors: string[] }) {
  return (
    <div className="flex items-center -space-x-3" aria-hidden="true">
      {colors.map((color, i) => (
        <span
          key={`${color}-${i}`}
          className="size-9 rounded-full ring-1 ring-current/15"
          style={{ background: color, zIndex: colors.length - i }}
        />
      ))}
    </div>
  )
}

/**
 * The base-size chip. Its own corners are drawn at the theme's control radius,
 * so the chip is a sample of the thing it names rather than a label about it —
 * `Ro` reads as a circle, `Sq` as a hard square. The dashed border says it is a
 * property of the theme rather than a control you can press.
 */
function EdgeChip({ edges, radius }: { edges: string; radius?: string }) {
  return (
    <span
      className="grid size-11 shrink-0 place-items-center border border-dashed border-current/40 text-sm"
      style={{ borderRadius: radius ?? "0.75rem" }}
      title={`Edges: ${edges}`}
    >
      {EDGE_CODE[edges] ?? edges.slice(0, 2)}
    </span>
  )
}

/**
 * One row, painted in the theme it represents.
 *
 * This is the point of the page: you judge a theme by looking at it, so the row
 * wears the theme's own background, foreground and border, and writes its name
 * in its own primary font. A list of identically-styled rows with a few
 * swatches on the end tells you far less.
 */
function ThemeRow({
  theme,
  dragging,
  armed,
  onArm,
  onDragStart,
  onDrop,
  onDragEnd,
  onMoveUp,
  onEdit,
  onDelete,
}: {
  theme: Theme
  dragging: boolean
  armed: boolean
  onArm: (armed: boolean) => void
  onDragStart: () => void
  onDrop: () => void
  onDragEnd: () => void
  onMoveUp: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  // a Google-font theme has to fetch its face before the name can be set in it
  useGoogleFont(theme.fontSource === "google" ? theme.fonts?.primary : undefined)

  const t = theme.tokens ?? {}
  const date = formatDate(theme.updatedAt)
  const locked = theme.name === "system"

  return (
    <li
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={cn(
        "flex items-center gap-5 px-6 py-4 ring-1 ring-current/10 transition-opacity",
        dragging && "opacity-50"
      )}
      style={{
        background: t.background,
        color: t.foreground,
        // the row's corners are the theme's container radius, so the list also
        // reads as a column of that theme's shape
        borderRadius: t["radius-container"] ?? "1.5rem",
      }}
    >
      <button
        type="button"
        aria-label={`Move ${theme.label} up`}
        onClick={onMoveUp}
        className="cursor-grab opacity-40 transition-opacity hover:opacity-100"
      >
        <DotsSixVerticalIcon className="size-5" />
      </button>

      <div className="flex min-w-0 flex-1 flex-col">
        {date && <span className="text-xs opacity-60">{date}</span>}
        <span
          className="truncate text-3xl leading-tight"
          style={{ fontFamily: theme.fonts?.primary ? `'${theme.fonts.primary}'` : undefined }}
        >
          {theme.label}
        </span>
      </div>

      <Swatches colors={theme.swatches ?? []} />

      <EdgeChip edges={theme.edges} radius={t.radius} />

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Edit ${theme.label}`}
          onClick={onEdit}
          className="grid size-10 place-items-center rounded-full bg-current/10 transition-colors hover:bg-current/20"
        >
          <PencilSimpleIcon className="size-4" />
        </button>

        <button
          type="button"
          aria-label={armed ? `Confirm delete ${theme.label}` : `Delete ${theme.label}`}
          onClick={() => (armed ? onDelete() : onArm(true))}
          onBlur={() => onArm(false)}
          disabled={locked}
          title={locked ? "The system theme cannot be deleted" : undefined}
          className={cn(
            "grid size-10 place-items-center rounded-full transition-colors disabled:opacity-30",
            armed
              ? "bg-destructive text-destructive-foreground"
              : "bg-current/10 text-destructive hover:bg-current/20"
          )}
        >
          <TrashIcon className="size-4" />
        </button>
      </div>
    </li>
  )
}

export function ThemeList({
  themes,
  onNew,
  onEdit,
  onDelete,
  onReorder,
}: {
  themes: Theme[]
  onNew: () => void
  onEdit: (theme: Theme) => void
  onDelete: (theme: Theme) => void
  onReorder: (names: string[]) => void
}) {
  const [dragging, setDragging] = useState<string | null>(null)
  const [armed, setArmed] = useState<string | null>(null)

  const move = (name: string, direction: -1 | 1) => {
    const from = themes.findIndex((t) => t.name === name)
    const to = from + direction
    if (from === -1 || to < 0 || to >= themes.length) return
    const next = [...themes]
    const [row] = next.splice(from, 1)
    next.splice(to, 0, row!)
    onReorder(next.map((t) => t.name))
  }

  const dropOn = (target: string) => {
    if (!dragging || dragging === target) return
    const next = themes.map((t) => t.name).filter((n) => n !== dragging)
    next.splice(next.indexOf(target), 0, dragging)
    onReorder(next)
    setDragging(null)
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16">
      <header className="flex items-center justify-between">
        <h1 className="text-6xl font-light tracking-tight">Themes</h1>
        <Button onClick={onNew}>
          <PlusIcon data-icon="inline-start" />
          New
        </Button>
      </header>

      <ul className="flex flex-col gap-3">
        {themes.map((theme) => (
          <ThemeRow
            key={theme.name}
            theme={theme}
            dragging={dragging === theme.name}
            armed={armed === theme.name}
            onArm={(next) => setArmed(next ? theme.name : null)}
            onDragStart={() => setDragging(theme.name)}
            onDrop={() => dropOn(theme.name)}
            onDragEnd={() => setDragging(null)}
            onMoveUp={() => move(theme.name, -1)}
            onEdit={() => onEdit(theme)}
            onDelete={() => {
              onDelete(theme)
              setArmed(null)
            }}
          />
        ))}
      </ul>

      {themes.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No themes yet — create one to get started.
        </p>
      )}
    </div>
  )
}
