import { CheckCircleIcon } from "@phosphor-icons/react"

import { Input } from "@workspace/ui/components/input"
import { EDGES } from "@workspace/ui/tokens/color"
import { useGoogleFont } from "./useGoogleFont"

/**
 * A colour well. Unset shows the rainbow ring from the designs; set shows the
 * colour inside that ring, so you can always tell "not chosen yet" from "chosen".
 */
export function ColorSeed({
  label,
  value,
  onChange,
}: {
  label: string
  value?: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm">{label}</span>
      <label
        className="relative size-9 shrink-0 cursor-pointer rounded-full p-[3px]"
        style={{
          background:
            "conic-gradient(from 0deg, #ff0080, #ff8c00, #ffed00, #00d26a, #00b8d9, #6554c0, #ff0080)",
        }}
      >
        <span
          className="block size-full rounded-full border border-white/70"
          style={{ background: value ?? "transparent" }}
        />
        <input
          type="color"
          aria-label={label}
          value={value ?? "#ffffff"}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </label>
    </div>
  )
}

/** Font name field with the resolved checkmark from the designs. */
export function FontField({
  label,
  value,
  onChange,
}: {
  label: string
  value?: string
  onChange: (value: string) => void
}) {
  const status = useGoogleFont(value)

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm text-foreground/80">{label}</span>
      <div className="relative">
        <Input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Font name"
          aria-label={`${label} font`}
          className="pr-10"
          style={value && status === "ready" ? { fontFamily: `'${value}', sans-serif` } : undefined}
        />
        {status === "ready" && (
          <CheckCircleIcon
            weight="fill"
            className="absolute top-1/2 right-2.5 size-5 -translate-y-1/2 text-foreground"
            aria-label={`${value} loaded`}
          />
        )}
        {status === "missing" && (
          <span className="absolute top-1/2 right-2.5 -translate-y-1/2 text-xs text-destructive">
            not found
          </span>
        )}
      </div>
    </div>
  )
}

// Drawn straight from the token source. Hand-copying these numbers is how the
// picker came to preview `strong` at 16px while the tokens said 12px.
const EDGE_PREVIEW: Record<string, string> = EDGES

/** The four radius presets, drawn as the shape they produce. */
export function EdgePicker({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      {Object.entries(EDGE_PREVIEW).map(([key, radius]) => {
        const selected = value === key
        return (
          <div key={key} className="flex items-center justify-between gap-4">
            <span className="text-sm capitalize">{key}</span>
            <button
              type="button"
              aria-label={`${key} corners`}
              aria-pressed={selected}
              onClick={() => onChange(key)}
              className="h-10 w-14 border transition-colors"
              style={{
                borderRadius: radius,
                background: selected ? "var(--foreground)" : "var(--card)",
                borderColor: selected ? "var(--foreground)" : "var(--border)",
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
