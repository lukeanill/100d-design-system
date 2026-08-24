import { Link } from "react-router"
import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"

const TYPE_SCALE = [
  { tag: "h1", label: "Heading 1", size: "2.25rem", weight: 700, leading: "1.2", tracking: "-0.025em" },
  { tag: "h2", label: "Heading 2", size: "1.875rem", weight: 600, leading: "1.25", tracking: "-0.02em" },
  { tag: "h3", label: "Heading 3", size: "1.5rem", weight: 600, leading: "1.3", tracking: "-0.015em" },
  { tag: "h4", label: "Heading 4", size: "1.25rem", weight: 500, leading: "1.4", tracking: "-0.01em" },
  { tag: "h5", label: "Heading 5", size: "1.125rem", weight: 500, leading: "1.5", tracking: "0" },
  { tag: "h6", label: "Heading 6", size: "1rem", weight: 500, leading: "1.5", tracking: "0" },
] as const

const COLOR_TOKENS = [
  { group: "Surface", tokens: ["background", "foreground", "card", "card-foreground", "popover", "popover-foreground"] },
  { group: "Brand", tokens: ["primary", "primary-foreground", "secondary", "secondary-foreground", "ring"] },
  { group: "Neutral", tokens: ["muted", "muted-foreground", "accent", "accent-foreground", "input"] },
  { group: "Feedback", tokens: ["destructive", "border"] },
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
  { name: "font-heading", sample: "Aa Bb Cc 123" },
  { name: "font-body", sample: "Aa Bb Cc 123" },
  { name: "font-sans", sample: "Aa Bb Cc 123" },
  { name: "font-mono", sample: "Aa Bb Cc 123" },
] as const

function ColorSwatch({ token }: { token: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="size-10 shrink-0 rounded-lg border border-border/60 shadow-sm"
        style={{ background: `var(--${token})` }}
      />
      <div className="min-w-0">
        <div className="truncate text-sm font-medium">{token}</div>
        <div className="truncate text-xs text-muted-foreground">--{token}</div>
      </div>
    </div>
  )
}

export function Tokens() {
  return (
    <div className="mx-auto flex min-h-svh max-w-4xl flex-col gap-12 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Typography &amp; Tokens</h1>
          <p className="text-muted-foreground text-sm">
            Every text style and design token in the system, with live values from the
            current theme.
          </p>
        </div>
        <Button variant="outline" nativeButton={false} render={<Link to="/">Back to preview</Link>} />
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Font families</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {FONT_TOKENS.map((font) => (
            <div key={font.name} className="rounded-2xl border p-4">
              <div className="mb-2 text-xs text-muted-foreground">--{font.name}</div>
              <div
                className="text-2xl"
                style={{ fontFamily: `var(--${font.name})` }}
              >
                {font.sample}
              </div>
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
                {t.tag === "h1" && <h1>The quick brown fox</h1>}
                {t.tag === "h2" && <h2>The quick brown fox</h2>}
                {t.tag === "h3" && <h3>The quick brown fox</h3>}
                {t.tag === "h4" && <h4>The quick brown fox</h4>}
                {t.tag === "h5" && <h5>The quick brown fox</h5>}
                {t.tag === "h6" && <h6>The quick brown fox</h6>}
              </div>
              <div className="shrink-0 text-right text-xs text-muted-foreground">
                <div className="font-medium text-foreground">{t.label}</div>
                <div>{t.size} · weight {t.weight}</div>
                <div>leading {t.leading} · tracking {t.tracking}</div>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between gap-6 p-4">
            <p className="text-base">Body text — the quick brown fox jumps over the lazy dog.</p>
            <div className="shrink-0 text-right text-xs text-muted-foreground">
              <div className="font-medium text-foreground">Body</div>
              <div>1rem · font-body</div>
            </div>
          </div>
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

      <section className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold">Color tokens</h2>
        {COLOR_TOKENS.map((group) => (
          <div key={group.group} className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-muted-foreground">{group.group}</h3>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
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
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
