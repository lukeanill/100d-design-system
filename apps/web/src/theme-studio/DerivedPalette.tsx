import { Button } from "@workspace/ui/components/button"
import { DERIVED_SWATCHES, checkContrast, fmt, oklchToHex, resolve } from "@workspace/ui/tokens/color"

type Check = { fg: string; bg: string; label: string; ratio: number; pass: boolean }

/**
 * Resolve a token to a real colour, following `var(--x)` aliases.
 *
 * `border` is `var(--muted)` and `input` is `var(--card)` in every theme, so
 * reading the raw value gave no colour: the well rendered empty and the picker
 * was disabled. Following the alias gives both a colour to show and a value to
 * edit — and editing one writes a literal, which is what overriding an alias
 * means.
 */
const swatchOf = (tokens: Record<string, string>, token: string) => {
  const resolved = resolve(tokens, token)
  return resolved ? { hex: oklchToHex(resolved), css: fmt(resolved) } : null
}

/**
 * The twelve derived tokens, each editable. Editing one records an override so
 * a later Refresh re-derives everything else around it instead of discarding it.
 */
export function DerivedPalette({
  tokens,
  hasSeeds,
  onGenerate,
  onOverride,
}: {
  tokens: Record<string, string>
  hasSeeds: boolean
  onGenerate: () => void
  onOverride: (token: string, value: string) => void
}) {
  const generated = Object.keys(tokens).length > 0
  const checks: Check[] = generated ? checkContrast(tokens) : []
  const failureFor = (token: string) =>
    checks.find((c) => !c.pass && (c.fg === token || c.bg === token))

  return (
    <section className="rounded-2xl bg-card p-6 shadow-xs">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={onGenerate} disabled={!hasSeeds}>
          {generated ? "Refresh" : "Generate Palette"}
        </Button>
      </div>

      {generated ? (
        <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
          {DERIVED_SWATCHES.map(({ token, label }: { token: string; label: string }) => {
            const swatch = swatchOf(tokens, token)
            const failure = failureFor(token)
            return (
              <div key={token} className="flex items-center justify-end gap-3">
                <span className="text-right text-sm">
                  {label}
                  {failure && (
                    <span className="block text-xs text-destructive">
                      {failure.ratio}:1 — {failure.label}
                    </span>
                  )}
                </span>
                <label
                  className="relative size-9 shrink-0 cursor-pointer rounded-full p-[3px]"
                  style={{
                    background: failure
                      ? "var(--destructive)"
                      : "conic-gradient(from 0deg, #ff0080, #ff8c00, #ffed00, #00d26a, #00b8d9, #6554c0, #ff0080)",
                  }}
                >
                  <span
                    className="block size-full rounded-full border border-white/70"
                    style={{ background: swatch?.css ?? tokens[token] }}
                  />
                  <input
                    type="color"
                    aria-label={label}
                    value={swatch?.hex ?? "#ffffff"}
                    onChange={(e) => onOverride(token, e.target.value)}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    // only a token that resolves to nothing at all stays uneditable
                    disabled={!swatch}
                  />
                </label>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          {hasSeeds
            ? "Generate a palette to fill the remaining tokens."
            : "Pick the four seed colours first."}
        </p>
      )}
    </section>
  )
}
