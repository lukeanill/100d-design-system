import { CheckIcon } from "@phosphor-icons/react"
import type { ReactNode } from "react"

import { Popover, PopoverPanel, PopoverTrigger } from "@workspace/ui/components/animate-ui/components/base/popover"
import { cn } from "@workspace/ui/lib/utils"
import { FONT_CHOICES, fontChoice, isHex, normalizeHex } from "@workspace/ui/themes"

const EMPTY = "#d9d9d9"

/** The label under a picker, as the Figma sets it. */
const Label = ({ children }: { children: ReactNode }) => <span className="text-sm text-white">{children}</span>

function Shell({ label, trigger, children, error }: { label: string; trigger: ReactNode; children: ReactNode; error?: string }) {
  return (
    <div className="flex w-[78px] flex-col items-center gap-3">
      <Popover>
        <PopoverTrigger render={trigger as React.ReactElement} />
        <PopoverPanel className="w-64">{children}</PopoverPanel>
      </Popover>
      <Label>{label}</Label>
      {error && (
        <span role="alert" className="-mt-1 max-w-[140px] text-center text-xs text-destructive">
          {error}
        </span>
      )}
    </div>
  )
}

/** A colour: a circle that fills in, with a hex field that says when it is not a colour. */
export function ColorPicker({ label, value, onChange }: { label: string; value: string | undefined; onChange: (v: string) => void }) {
  const valid = value === undefined || isHex(value)
  const shown = value && valid ? normalizeHex(value) : EMPTY
  return (
    <Shell
      label={label}
      error={valid ? undefined : "Use a colour like #1a2b3c"}
      trigger={
        <button
          type="button"
          aria-label={`${label} colour`}
          aria-invalid={!valid}
          className={cn("size-10 cursor-pointer rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50", !valid && "ring-2 ring-destructive")}
          style={{ background: shown }}
        />
      }
    >
      <div className="flex flex-col gap-3">
        <input
          type="color"
          aria-label={`${label} colour picker`}
          value={value && valid ? normalizeHex(value) : "#888888"}
          onChange={(e) => onChange(e.target.value)}
          className="h-24 w-full cursor-pointer rounded-md border-0 bg-transparent p-0"
        />
        <input
          type="text"
          aria-label={`${label} hex value`}
          aria-invalid={!valid}
          placeholder="#000000"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={cn("h-9 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50", !valid && "border-destructive")}
        />
      </div>
    </Shell>
  )
}

export interface Option<T extends string> {
  value: T
  label: string
  visual?: ReactNode
}

/** One of a few options, drawn as a small square that shows the choice. */
export function ChoicePicker<T extends string>({
  label,
  value,
  options,
  onChange,
  shape = "square",
}: {
  label: string
  value: T | undefined
  options: Option<T>[]
  onChange: (v: T) => void
  shape?: "square" | "circle"
}) {
  const chosen = options.find((o) => o.value === value)
  return (
    <Shell
      label={label}
      trigger={
        <button
          type="button"
          aria-label={`${label}: ${chosen?.label ?? "not chosen"}`}
          className={cn(
            "grid cursor-pointer place-items-center overflow-hidden text-[#1b1717] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
            shape === "circle" ? "size-10 rounded-full" : "size-[62px] rounded-[2px]"
          )}
          style={{ background: EMPTY }}
        >
          {chosen ? (chosen.visual ?? <span className="text-xs">{chosen.label}</span>) : null}
        </button>
      }
    >
      <ul className="flex flex-col gap-1" role="listbox" aria-label={label}>
        {options.map((o) => (
          <li key={o.value} role="option" aria-selected={o.value === value}>
            <button
              type="button"
              onClick={() => onChange(o.value)}
              className="flex w-full cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
            >
              <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded bg-white/10 text-foreground">{o.visual}</span>
              <span className="flex-1">{o.label}</span>
              {o.value === value && <CheckIcon size={14} />}
            </button>
          </li>
        ))}
      </ul>
    </Shell>
  )
}

/** A font family from the catalogue, each name set in itself. */
export function FontPicker({ label, value, onChange }: { label: string; value: string | undefined; onChange: (family: string) => void }) {
  return (
    <FieldShell label={label} value={value} onOpenLabel="font">
      <ul className="flex max-h-72 flex-col gap-0.5 overflow-y-auto" role="listbox" aria-label={label}>
        {FONT_CHOICES.map((f) => (
          <li key={f.family} role="option" aria-selected={f.family === value}>
            <button
              type="button"
              onClick={() => onChange(f.family)}
              className="flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-left text-base hover:bg-muted"
              style={{ fontFamily: `'${f.family}', ${f.kind === "mono" ? "monospace" : f.kind === "sans" ? "sans-serif" : "serif"}` }}
            >
              {f.family}
              {f.family === value && <CheckIcon size={14} />}
            </button>
          </li>
        ))}
      </ul>
    </FieldShell>
  )
}

/** A weight the chosen family actually has. */
export function WeightPicker({ label, family, value, onChange }: { label: string; family: string | undefined; value: number | undefined; onChange: (w: number) => void }) {
  const weights = (family && fontChoice(family)?.weights) || [300, 400, 500, 600, 700]
  return (
    <FieldShell label={label} value={value === undefined ? undefined : String(value)}>
      <ul className="flex flex-col gap-0.5" role="listbox" aria-label={label}>
        {weights.map((w) => (
          <li key={w} role="option" aria-selected={w === value}>
            <button
              type="button"
              onClick={() => onChange(w)}
              className="flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
              style={{ fontFamily: family ? `'${family}'` : undefined, fontWeight: w }}
            >
              {w}
              {w === value && <CheckIcon size={14} />}
            </button>
          </li>
        ))}
      </ul>
    </FieldShell>
  )
}

function FieldShell({ label, value, children }: { label: string; value: string | undefined; children: ReactNode; onOpenLabel?: string }) {
  return (
    <div className="flex w-[114px] flex-col items-center gap-3">
      <Popover>
        <PopoverTrigger
          render={
            <button
              type="button"
              aria-label={`${label}: ${value ?? "not chosen"}`}
              className="h-[29px] w-full cursor-pointer truncate rounded-[2px] px-2 text-left text-xs text-[#1b1717] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              style={{ background: EMPTY }}
            />
          }
        >
          {value}
        </PopoverTrigger>
        <PopoverPanel className="w-60">{children}</PopoverPanel>
      </Popover>
      <Label>{label}</Label>
    </div>
  )
}
