import { useEffect, useState } from "react"
import { Link } from "react-router"
import { Button } from "@workspace/ui/components/button"
import { NativeSelect } from "@workspace/ui/components/native-select"
import { Separator } from "@workspace/ui/components/separator"
import { useTheme } from "@workspace/ui/components/theme-provider"
import { figmaVariableFor, getPreset } from "@workspace/ui/themes"

const TYPE_SCALE = [
  { tag: "h1", label: "Heading 1" },
  { tag: "h2", label: "Heading 2" },
  { tag: "h3", label: "Heading 3" },
  { tag: "h4", label: "Heading 4" },
  { tag: "h5", label: "Heading 5" },
  { tag: "h6", label: "Heading 6" },
] as const

const BODY_STYLES = [
  { className: "text-sm", label: "Body Small" },
  { className: "text-md", label: "Body" },
  { className: "text-md-italic", label: "Body Italic" },
  { className: "text-lg", label: "Body Large" },
  { className: "text-lg-italic", label: "Body Large Italic" },
] as const

const GRADIENT_TOKENS = [
  { name: "gradient-downlight", label: "Gradient Downlight" },
  { name: "gradient-rise", label: "Gradient Rise" },
  { name: "gradient-set", label: "Gradient Set" },
] as const

const COLOR_TOKENS = [
  { group: "Surface", tokens: ["background", "foreground", "card", "card-foreground", "popover", "popover-foreground"] },
  { group: "Brand", tokens: ["primary", "primary-foreground", "secondary", "secondary-foreground", "primitive-700", "primitive-800", "ring"] },
  { group: "Neutral", tokens: ["muted", "muted-foreground", "accent", "accent-foreground", "input"] },
  { group: "Feedback", tokens: ["destructive", "affirmative", "affirmative-foreground", "focus", "border"] },
  { group: "Chart", tokens: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"] },
  { group: "Sidebar", tokens: ["sidebar", "sidebar-foreground", "sidebar-primary", "sidebar-primary-foreground", "sidebar-accent", "sidebar-accent-foreground", "sidebar-border", "sidebar-ring"] },
] as const

const RADIUS_TOKENS = [
  { name: "radius-sm", label: "sm" },
  { name: "radius-md", label: "md" },
  { name: "radius-lg", label: "lg (base)" },
  { name: "radius-xl", label: "xl" },
  { name: "radius-2xl", label: "2xl" },
  { name: "radius-3xl", label: "3xl" },
  { name: "radius-4xl", label: "4xl" },
] as const

const SHADOW_TOKENS = [
  "shadow-2xs",
  "shadow-xs",
  "shadow-sm",
  "shadow",
  "shadow-md",
  "shadow-lg",
  "shadow-xl",
  "shadow-2xl",
] as const

const FONT_TOKENS = [
  { name: "font-primary", sample: "Aa Bb Cc 123" },
  { name: "font-body", sample: "Aa Bb Cc 123" },
  { name: "font-secondary", sample: "Aa Bb Cc 123" },
  { name: "font-mono", sample: "Aa Bb Cc 123" },
] as const

/**
 * The Figma variable a token maps to, with the mode of its collection that the current theme uses. The map itself
 * is shared with the Storybook Tokens panel (`figmaVariableFor`), so the two always agree.
 */
function useFigma() {
  const { theme } = useTheme()
  const preset = getPreset(theme)
  const find = (key: string) => (preset ? figmaVariableFor(key, preset) : null)
  /** The label for a token: its Figma variable and mode, or undefined when it has none. */
  const label = (key: string) => {
    const f = find(key)
    return f ? `${f.variable} · ${f.mode}` : undefined
  }
  label.variable = (key: string) => find(key)?.variable
  return label
}

const FONT_NAMES = FONT_TOKENS.map((f) => f.name)

function ColorSwatch({ token }: { token: string }) {
  const fig = useFigma()
  return (
    <div className="grid grid-cols-2 items-center gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className="size-10 shrink-0 rounded-lg border border-border/60 shadow-sm"
          style={{ background: `var(--${token})` }}
        />
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{token}</div>
          <div className="truncate text-xs text-muted-foreground">--{token}</div>
        </div>
      </div>
      {fig.variable(token) && (
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="size-10 shrink-0 rounded-lg border border-border/60 shadow-sm"
            style={{ background: `var(--${token})` }}
          />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{fig.variable(token)!.split("/").pop()}</div>
            <div className="truncate text-xs text-muted-foreground">{fig(token)}</div>
          </div>
        </div>
      )}
    </div>
  )
}

/** The size, in px, the current theme gives a typescale step (--typescale-<step>, written in rem). */
function useTypescale() {
  const { theme } = useTheme()
  const [sizes, setSizes] = useState<Record<string, string>>({})
  useEffect(() => {
    // wait a frame so the theme's class and stylesheet are on <html> before they are read
    const id = requestAnimationFrame(() => {
      const cs = getComputedStyle(document.documentElement)
      const out: Record<string, string> = {}
      for (const step of ["sm", "md", "lg", "h1", "h2", "h3", "h4", "h5", "h6"]) {
        const rem = parseFloat(cs.getPropertyValue(`--typescale-${step}`))
        if (!Number.isNaN(rem)) out[step] = `${Math.round(rem * 16 * 100) / 100}px`
      }
      setSizes(out)
    })
    return () => cancelAnimationFrame(id)
  }, [theme])
  return sizes
}

/** The first font family of each font token in the current theme, for example "DentonVariable Test". */
function useFontNames(tokens: readonly string[]) {
  const { theme } = useTheme()
  const [names, setNames] = useState<Record<string, string>>({})
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const cs = getComputedStyle(document.documentElement)
      setNames(
        Object.fromEntries(
          tokens.map((t) => [t, cs.getPropertyValue(`--${t}`).split(",")[0].trim().replace(/^["']|["']$/g, "")]),
        ),
      )
    })
    return () => cancelAnimationFrame(id)
  }, [theme, tokens])
  return names
}

/**
 * What the theme gives a piece of text, read from the rendered element: its size, weight, line-height and
 * character-spacing. Every element with a `data-measure` is read, and the key is the attribute's value.
 */
interface Measured {
  size: string
  weight: string
  lineHeight: string
  spacing: string
}
const round = (n: number) => Math.round(n * 100) / 100
function useMeasured() {
  const { theme } = useTheme()
  const [measured, setMeasured] = useState<Record<string, Measured>>({})
  useEffect(() => {
    let cancelled = false
    const read = () => {
      if (cancelled) return
      const out: Record<string, Measured> = {}
      for (const el of document.querySelectorAll<HTMLElement>("[data-measure]")) {
        const cs = getComputedStyle(el)
        const px = parseFloat(cs.fontSize)
        const lh = parseFloat(cs.lineHeight)
        const ls = parseFloat(cs.letterSpacing)
        out[el.dataset.measure!] = {
          size: `${round(px)}px`,
          weight: cs.fontWeight,
          lineHeight: Number.isNaN(lh) ? "normal" : `${round((lh / px) * 100)}%`,
          spacing: Number.isNaN(ls) ? "0%" : `${round((ls / px) * 100)}%`,
        }
      }
      setMeasured(out)
    }
    // wait a frame so the theme's class and stylesheet are applied, and for the fonts, before reading
    const id = requestAnimationFrame(() => document.fonts.ready.then(read))
    return () => {
      cancelled = true
      cancelAnimationFrame(id)
    }
  }, [theme])
  return measured
}

export function Tokens() {
  const sizes = useTypescale()
  const measured = useMeasured()
  const fontNames = useFontNames(FONT_NAMES)
  const fig = useFigma()
  const { theme, setTheme, themes } = useTheme()
  return (
    <div className="mx-auto flex min-h-svh max-w-4xl flex-col gap-12 p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold">Typography &amp; Tokens</h1>
          <p className="text-muted-foreground text-sm">
            Every text style and design token in the system, with live values from the
            current theme.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <NativeSelect themed className="shrink-0" aria-label="Theme" value={theme} onChange={(e) => setTheme(e.target.value)}>
            {themes.map((id) => (
              <option key={id} value={id}>
                {getPreset(id)?.label ?? id}
              </option>
            ))}
          </NativeSelect>
          <Button variant="outline" nativeButton={false} render={<Link to="/">Back to preview</Link>} />
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Font families</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {FONT_TOKENS.map((font) => (
            <div key={font.name} className="rounded-2xl border p-4">
              <div className="mb-2 flex justify-between gap-2 text-xs text-muted-foreground">
                <span>--{font.name}</span>
                {fig(font.name) && <span>{fig(font.name)}</span>}
              </div>
              <div
                className="text-2xl"
                style={{ fontFamily: `var(--${font.name})` }}
              >
                {font.sample}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">{fontNames[font.name]}</div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Type scale</h2>
        <div className="flex flex-col divide-y divide-border rounded-2xl border">
          {TYPE_SCALE.map((t) => (
            <div key={t.tag} className="flex items-center justify-between gap-6 p-4">
              <div className="min-w-0">
                {t.tag === "h1" && <h1 data-measure="h1">The quick brown fox</h1>}
                {t.tag === "h2" && <h2 data-measure="h2">The quick brown fox</h2>}
                {t.tag === "h3" && <h3 data-measure="h3">The quick brown fox</h3>}
                {t.tag === "h4" && <h4 data-measure="h4">The quick brown fox</h4>}
                {t.tag === "h5" && <h5 data-measure="h5">The quick brown fox</h5>}
                {t.tag === "h6" && <h6 data-measure="h6">The quick brown fox</h6>}
              </div>
              <div className="shrink-0 text-right text-xs text-muted-foreground">
                <div className="font-medium text-foreground">{t.label}</div>
                <div>{measured[t.tag]?.size} · weight {measured[t.tag]?.weight}</div>
                <div>line-height {measured[t.tag]?.lineHeight}</div>
                <div>character-spacing {measured[t.tag]?.spacing}</div>
                <div>{fig(t.tag)} · {sizes[t.tag]}</div>
              </div>
            </div>
          ))}
          {BODY_STYLES.map((b) => (
            <div key={b.className} className="flex items-center justify-between gap-6 p-4">
              <p className={b.className} data-measure={b.className}>The quick brown fox jumps over the lazy dog.</p>
              <div className="shrink-0 text-right text-xs text-muted-foreground">
                <div className="font-medium text-foreground">{b.label}</div>
                <div>{measured[b.className]?.size} · weight {measured[b.className]?.weight}</div>
                <div>line-height {measured[b.className]?.lineHeight}</div>
                <div>character-spacing {measured[b.className]?.spacing}</div>
                <div>{fig(b.className)} · {sizes[b.className.replace("text-", "").replace("-italic", "")]}</div>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between gap-6 p-4">
            <code className="font-mono text-sm">const design = "system"</code>
            <div className="shrink-0 text-right text-xs text-muted-foreground">
              <div className="font-medium text-foreground">Mono</div>
              <div>font-mono</div>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Gradients</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {GRADIENT_TOKENS.map((g) => (
            <div key={g.name} className="flex flex-col gap-2">
              <div
                className="h-24 rounded-2xl border border-border/60"
                style={{ backgroundImage: `var(--${g.name})` }}
              />
              <div className="text-sm font-medium">{g.label}</div>
              <div className="text-xs text-muted-foreground">--{g.name}</div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      <section className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold">Color tokens</h2>
        {COLOR_TOKENS.map((group) => (
          <div key={group.group} className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-muted-foreground">{group.group}</h3>
            <div className="grid grid-cols-2 gap-3 text-xs font-medium text-muted-foreground">
              <div>Code</div>
              <div>Figma</div>
            </div>
            <div className="grid gap-3">
              {group.tokens.map((token) => (
                <ColorSwatch key={token} token={token} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <Separator />

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Radius</h2>
        <div className="flex flex-wrap gap-4">
          {RADIUS_TOKENS.map((r) => (
            <div key={r.name} className="flex flex-col items-center gap-2">
              <div
                className="size-16 border-2 border-primary/60 bg-muted"
                style={{ borderRadius: `var(--${r.name})` }}
              />
              <div className="text-xs text-muted-foreground">{r.label}</div>
              {fig(r.name) && <div className="text-xs text-muted-foreground">{fig(r.name)}</div>}
            </div>
          ))}
        </div>
      </section>

      <Separator />

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Shadows</h2>
        <div className="grid gap-6 sm:grid-cols-4">
          {SHADOW_TOKENS.map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <div
                className="size-16 rounded-xl bg-card"
                style={{ boxShadow: `var(--${s})` }}
              />
              <div className="text-xs text-muted-foreground">--{s}</div>
              {fig(s) && <div className="text-xs text-muted-foreground">{fig(s)}</div>}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
