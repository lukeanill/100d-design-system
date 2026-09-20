import { Button } from "@workspace/ui/components/button"
// @ts-expect-error - shared .mjs colour engine, also used by the build scripts
import { DERIVED_SWATCHES, checkContrast, oklchToHex, parseOklch } from "@workspace/ui/tokens/color"

type Check = { fg: string; bg: string; label: string; ratio: number; pass: boolean }

const toHex = (value?: string) => {
  if (!value) return undefined
  const parsed = parseOklch(value)
  return parsed ? oklchToHex(parsed) : undefined
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
            const hex = toHex(tokens[token])
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
                    style={{ background: tokens[token] }}
                  />
                  <input
                    type="color"
                    aria-label={label}
                    value={hex ?? "#ffffff"}
                    onChange={(e) => onOverride(token, e.target.value)}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    // aliases like var(--muted) have no hex to show
                    disabled={!hex}
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
