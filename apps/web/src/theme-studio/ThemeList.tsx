import { useState } from "react"
import { DotsSixVerticalIcon, PlusIcon } from "@phosphor-icons/react"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import type { Theme } from "./api"

/** The six overlapping circles each row shows. */
function Swatches({ colors }: { colors: string[] }) {
  return (
    <div className="flex items-center -space-x-2" aria-hidden="true">
      {colors.map((color, i) => (
        <span
          key={`${color}-${i}`}
          className="size-8 rounded-full border border-border/40 shadow-sm"
          style={{ background: color, zIndex: colors.length - i }}
        />
      ))}
    </div>
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
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

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
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-16">
      <header className="flex items-center justify-between">
        <h1 className="text-5xl font-light tracking-tight">Themes</h1>
        <Button onClick={onNew}>
          <PlusIcon data-icon="inline-start" />
          New
        </Button>
      </header>

      <ul className="flex flex-col gap-4">
        {themes.map((theme) => (
          <li
            key={theme.name}
            draggable
            onDragStart={() => setDragging(theme.name)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => dropOn(theme.name)}
            onDragEnd={() => setDragging(null)}
            className={cn(
              "flex items-center gap-4 rounded-2xl bg-card px-6 py-4 shadow-xs transition-opacity",
              dragging === theme.name && "opacity-50"
            )}
          >
            {/* keyboard users get explicit move controls rather than drag */}
            <div className="flex flex-col text-foreground/40">
              <button
                type="button"
                aria-label={`Move ${theme.label} up`}
                onClick={() => move(theme.name, -1)}
                className="cursor-grab leading-none hover:text-foreground"
              >
                <DotsSixVerticalIcon className="size-5" />
              </button>
            </div>

            <span className="flex-1 truncate text-2xl">{theme.label}</span>

            <Swatches colors={theme.swatches ?? []} />

            <Button size="sm" onClick={() => onEdit(theme)}>
              Edit
            </Button>

            {pendingDelete === theme.name ? (
              <span className="flex items-center gap-2 text-sm">
                <button
                  type="button"
                  className="text-destructive underline underline-offset-2"
                  onClick={() => {
                    onDelete(theme)
                    setPendingDelete(null)
                  }}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  className="text-foreground/60"
                  onClick={() => setPendingDelete(null)}
                >
                  Cancel
                </button>
              </span>
            ) : (
              <button
                type="button"
                className="text-sm text-destructive/80 hover:text-destructive"
                onClick={() => setPendingDelete(theme.name)}
                disabled={theme.name === "system"}
                title={theme.name === "system" ? "The system theme cannot be deleted" : undefined}
              >
                Delete
              </button>
            )}
          </li>
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
