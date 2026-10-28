import { CheckIcon } from "@phosphor-icons/react"
import type { CSSProperties, ReactNode } from "react"

import { Popover, PopoverPanel, PopoverTrigger } from "@workspace/ui/components/animate-ui/components/base/popover"
import { MetalSurface } from "@workspace/ui/components/metal-surface"
import { cn } from "@workspace/ui/lib/utils"
import { fontChoice, isHex, normalizeHex, type FontChoice } from "@workspace/ui/themes"

/** A colour that has not been chosen yet. */
const EMPTY = "#d9d9d9"

/** The fill of every token in the Figma: white at 5% fading to 7%. */
export const TOKEN_FILL = "bg-gradient-to-b from-white/5 to-white/[0.07]"

/** A token's label, as the Figma sets it: body large. */
const LABEL = "text-lg leading-[1.42]"

const focus = "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"

/* --- the square a choice is drawn on ------------------------------------------ */

/**
 * The small picture of one choice. The chosen one is ringed in liquid metal
 * (metal-fx v1); the rest are plain. metal-fx keeps the element it wraps
 * transparent and reads its border radius for the ring, so that element only
 * carries the size and the radius, and the fill and shadow are drawn on a layer
 * inside it (`style`, `className`).
 */
export function Swatch({
  selected,
  round = false,
  radius,
  className,
  style,
  children,
}: {
  selected: boolean
  round?: boolean
  radius?: number
  className?: string
  style?: CSSProperties
  children?: ReactNode
}) {
  return (
    <MetalSurface
      active={selected}
      variant={round ? "circle" : "button"}
      engine="v1"
      theme="dark"
      className="shrink-0 bg-transparent! backdrop-blur-none! hover:bg-transparent!"
    >
      <span className={cn("relative grid size-16 place-items-center", round ? "rounded-full" : "rounded-2xl")} style={radius === undefined ? undefined : { borderRadius: radius }}>
        <span aria-hidden className={cn("absolute inset-0 rounded-[inherit]", TOKEN_FILL, className)} style={style} />
        <span className="relative">{children}</span>
      </span>
    </MetalSurface>
  )
}

/** One choice: its picture and its name, a radio in a group. */
export function OptionRow({
  label,
  selected,
  onSelect,
  children,
  className,
  labelFirst = false,
}: {
  label: string
  selected: boolean
  onSelect: () => void
  children: ReactNode
  className?: string
  /** The name on the left, taking the room, with the pictures at the right (Spacing). */
  labelFirst?: boolean
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn("flex cursor-pointer items-center gap-3 rounded-[20px] text-left", LABEL, focus, className)}
    >
      {labelFirst && <span className="min-w-0 flex-1">{label}</span>}
      {children}
      {!labelFirst && <span>{label}</span>}
    </button>
  )
}

/** The choices of one tile. */
export const OptionGroup = ({ label, className, children }: { label: string; className?: string; children: ReactNode }) => (
  <div role="radiogroup" aria-label={label} className={className}>
    {children}
  </div>
)

/* --- colour ------------------------------------------------------------------- */

/** A colour: a round token filled with it. Opens a picker and a hex field that says when it is not a colour. */
export function ColorToken({ label, value, onChange }: { label: string; value: string | undefined; onChange: (v: string) => void }) {
  const valid = value === undefined || isHex(value)
  const shown = value && valid ? normalizeHex(value) : EMPTY
  return (
    <div className="flex flex-col gap-1">
      <Popover>
        <PopoverTrigger
          render={
            <button
              type="button"
              aria-label={`${label}: ${value ?? "not chosen"}`}
              aria-invalid={!valid}
              className={cn("flex cursor-pointer items-center gap-3 rounded-[20px] text-left", LABEL, focus)}
            />
          }
        >
          <span className={cn("size-16 shrink-0 rounded-full", !valid && "ring-2 ring-destructive")} style={{ background: shown }} />
          <span>{label}</span>
        </PopoverTrigger>
        <PopoverPanel className="w-64">
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
        </PopoverPanel>
      </Popover>
      {!valid && (
        <span role="alert" className="text-xs text-destructive">
          Use a colour like #1a2b3c
        </span>
      )}
    </div>
  )
}

/* --- dropdown tokens: a label over a wide token that opens a list -------------- */

function Dropdown({
  label,
  shown,
  shownStyle,
  placeholder,
  className,
  children,
}: {
  label: string
  shown: string | undefined
  /** How the chosen value is set: a font is shown in itself. */
  shownStyle?: CSSProperties
  placeholder?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <span className={LABEL}>{label}</span>
      <Popover>
        <PopoverTrigger
          render={
            <button
              type="button"
              aria-label={`${label}: ${shown ?? "not chosen"}`}
              className={cn("flex h-16 w-full cursor-pointer items-center rounded-2xl px-6 text-left", LABEL, TOKEN_FILL, focus)}
            />
          }
        >
          {shown ? (
            <span className="min-w-0 truncate" style={shownStyle}>
              {shown}
            </span>
          ) : (
            placeholder && <span className="min-w-0 truncate text-foreground/50">{placeholder}</span>
          )}
        </PopoverTrigger>
        <PopoverPanel className="w-60">{children}</PopoverPanel>
      </Popover>
    </div>
  )
}

/** A family from the catalogue as a CSS font stack, with the generic family it falls back to. */
function fontStack(family: string) {
  const kind = fontChoice(family)?.kind
  return `'${family}', ${kind === "mono" ? "monospace" : kind === "sans" ? "sans-serif" : "serif"}`
}

const item = "flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-left hover:bg-muted"

/** A font family from the catalogue, each name set in itself. */
export function FontToken({
  label,
  value,
  fonts,
  weight,
  onChange,
  className,
}: {
  label: string
  value: string | undefined
  /** The faces this role can use: headings from the themes' heading fonts, body from their body fonts. */
  fonts: FontChoice[]
  /** The weight chosen for it, so the name is shown as it will look. */
  weight?: number
  onChange: (family: string) => void
  className?: string
}) {
  return (
    <Dropdown label={label} shown={value} shownStyle={value ? { fontFamily: fontStack(value), fontWeight: weight } : undefined} placeholder="Select font" className={className}>
      <ul className="flex max-h-72 flex-col gap-0.5 overflow-y-auto" role="listbox" aria-label={label}>
        {fonts.map((f) => (
          <li key={f.family} role="option" aria-selected={f.family === value}>
            <button
              type="button"
              onClick={() => onChange(f.family)}
              className={cn(item, "text-base")}
              style={{ fontFamily: fontStack(f.family) }}
            >
              {f.family}
              {f.family === value && <CheckIcon size={14} />}
            </button>
          </li>
        ))}
      </ul>
    </Dropdown>
  )
}

/** A weight the chosen family actually has. */
export function WeightToken({ label, family, value, onChange, className }: { label: string; family: string | undefined; value: number | undefined; onChange: (w: number) => void; className?: string }) {
  const weights = (family && fontChoice(family)?.weights) || [300, 400, 500, 600, 700]
  return (
    <Dropdown label={label} shown={value === undefined ? undefined : String(value)} className={className}>
      <ul className="flex flex-col gap-0.5" role="listbox" aria-label={label}>
        {weights.map((w) => (
          <li key={w} role="option" aria-selected={w === value}>
            <button type="button" onClick={() => onChange(w)} className={cn(item, "text-sm")} style={{ fontFamily: family ? `'${family}'` : undefined, fontWeight: w }}>
              {w}
              {w === value && <CheckIcon size={14} />}
            </button>
          </li>
        ))}
      </ul>
    </Dropdown>
  )
}

/** One of a few named steps, chosen from a list. */
export function StepToken<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string
  value: T | undefined
  options: { value: T; label: string }[]
  onChange: (v: T) => void
  className?: string
}) {
  return (
    <Dropdown label={label} shown={options.find((o) => o.value === value)?.label} className={className}>
      <ul className="flex flex-col gap-0.5" role="listbox" aria-label={label}>
        {options.map((o) => (
          <li key={o.value} role="option" aria-selected={o.value === value}>
            <button type="button" onClick={() => onChange(o.value)} className={cn(item, "text-sm")}>
              {o.label}
              {o.value === value && <CheckIcon size={14} />}
            </button>
          </li>
        ))}
      </ul>
    </Dropdown>
  )
}

/* --- text --------------------------------------------------------------------- */

/** A wide token you type in: the theme's name. */
export function TextToken({ label, value, placeholder, onChange }: { label: string; value: string; placeholder: string; onChange: (v: string) => void }) {
  return (
    <input
      aria-label={label}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn("h-16 w-full rounded-2xl p-6 text-lg leading-[1.42] placeholder:text-foreground/50 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50", TOKEN_FILL)}
    />
  )
}

/* --- the Feel page's tokens: 47 high, 8 radius ---------------------------------- */

/** A column's heading, as the Figma sets it: centred, with 12 under it. */
export const ColumnLabel = ({ children }: { children: ReactNode }) => (
  <p className="px-6 pb-3 text-center text-base leading-[1.42]">{children}</p>
)

/**
 * One choice on the Feel page. The chosen one is ringed in liquid metal, like the Look page's.
 * `leading` is a small picture at the left (a colour), and the name then fills the rest.
 */
export function ChoiceToken({
  label,
  selected,
  onSelect,
  leading,
  className,
}: {
  label: string
  selected: boolean
  onSelect: () => void
  leading?: ReactNode
  className?: string
}) {
  return (
    <MetalSurface
      active={selected}
      variant="button"
      engine="v1"
      theme="dark"
      className={cn("w-full bg-transparent! backdrop-blur-none! hover:bg-transparent!", className)}
    >
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        onClick={onSelect}
        className={cn("relative flex h-[47px] w-full cursor-pointer items-center justify-center rounded-lg text-base leading-[1.42]", leading ? "gap-2 px-4" : "px-6", focus)}
      >
        <span aria-hidden className={cn("absolute inset-0 rounded-[inherit]", TOKEN_FILL)} />
        {leading && <span className="relative flex shrink-0">{leading}</span>}
        <span className={cn("relative whitespace-nowrap", leading && "flex-1 text-center")}>{label}</span>
      </button>
    </MetalSurface>
  )
}

/** An on/off setting: its name, and a circle that fills when it is on. */
export function ToggleToken({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={cn("relative flex h-[47px] w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-4 text-base leading-[1.42]", focus)}
    >
      <span aria-hidden className={cn("absolute inset-0 rounded-[inherit]", TOKEN_FILL)} />
      <span className="relative flex-1 text-left">{label}</span>
      <span aria-hidden className={cn("relative size-5 shrink-0 rounded-full border transition-colors", on ? "border-foreground bg-foreground" : "border-white/50")} />
    </button>
  )
}

