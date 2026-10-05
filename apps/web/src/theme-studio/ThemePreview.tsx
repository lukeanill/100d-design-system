import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import {
  glassDeclarations,
  headingGradientDeclarations,
  typographyDeclarations,
  // @ts-expect-error - shared .mjs settings tables, also used by the build scripts
} from "@workspace/ui/scripts/core/theme-settings"
import type { Effects, Fonts, Glass, Typography } from "./api"

/**
 * The designs leave this panel empty, so it renders a sampler of real library
 * components under the theme's own tokens — the studio dogfooding the system.
 */
export function ThemePreview({
  tokens,
  fonts,
  generated,
  glass,
  typography,
  effects,
}: {
  tokens: Record<string, string>
  fonts: Fonts
  generated: boolean
  glass?: Glass
  typography?: Typography
  effects?: Effects
}) {
  // The settings are previewed through the same emitters the generator writes
  // with, so what is shown here is what the stylesheet will say.
  const declarations = [
    ...(glassDeclarations(glass) as string[]),
    ...(typographyDeclarations(typography) as string[]),
    ...(headingGradientDeclarations(effects, tokens) as string[]),
  ]
  // The faces, set the way a theme's own block sets them: on the physical
  // variables the headings and body classes actually resolve. Without these the
  // sampler would render in whatever fonts the studio itself is wearing.
  const face = (family: string | undefined, fallback: string) =>
    family ? `'${family}', ${fallback}` : undefined
  const SANS = "ui-sans-serif, system-ui, sans-serif"
  const primary = face(fonts.primary, SANS)
  const emphasis = face(fonts.emphasis, "ui-serif, Georgia, serif")
  const body = face(fonts.body, SANS)
  const fontVariables = {
    // the physical variables, which the utilities resolve
    "--font-authentic-sans-60": primary,
    "--font-authentic-sans-90": primary,
    "--font-oranienbaum": emphasis,
    "--font-body-token": body,
    // and the aliases, because `--font-heading: var(--font-authentic-sans-60)`
    // was substituted at :root and would otherwise keep the studio's own face
    "--font-heading": primary,
    "--font-sans": primary,
    "--font-serif": emphasis,
    "--font-body": body,
    // the per-level defaults, so a level the theme left alone follows its
    // primary face rather than the page the preview is sitting on
    ...Object.fromEntries(
      ["h1", "h2", "h3", "h4", "h5", "h6"].map((level) => [`--${level}-family`, primary])
    ),
  }

  const style = Object.fromEntries([
    ...Object.entries(fontVariables).filter(([, value]) => value),
    ...Object.entries(tokens).map(([token, value]) => [`--${token}`, value]),
    ...declarations.map((line) => {
      const [name, ...rest] = line.replace(/;$/, "").split(":")
      return [name.trim(), rest.join(":").trim()]
    }),
  ]) as React.CSSProperties

  return (
    <section className="rounded-2xl bg-card p-6 shadow-xs">
      {generated ? (
        <div
          style={style}
          className="flex flex-col gap-5 rounded-xl bg-background p-6 text-foreground"
        >
          <h1>Heading 1</h1>
          <h3>Heading 3</h3>
          <h2 className="text-3xl">The quick brown fox</h2>
          <p className="text-body-serif">Emphasis face — jumps over the lazy dog.</p>
          <p className="text-body">Body text, at the size most of a page is set in.</p>
          <p className="text-sm text-muted-foreground">
            Muted text on the card surface, the pair that most often fails.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
            <Badge>Badge</Badge>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Card surface</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Cards, popovers and inputs all sit on the derived card colour.
            </CardContent>
          </Card>
          <Input placeholder="Input on the card surface" aria-label="Preview input" />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Generate a palette, then preview it against real components.
        </p>
      )}
    </section>
  )
}
