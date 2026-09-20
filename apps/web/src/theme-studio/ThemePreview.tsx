import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import type { Fonts } from "./api"

/**
 * The designs leave this panel empty, so it renders a sampler of real library
 * components under the theme's own tokens — the studio dogfooding the system.
 */
export function ThemePreview({
  tokens,
  fonts,
  onRefresh,
  generated,
}: {
  tokens: Record<string, string>
  fonts: Fonts
  onRefresh: () => void
  generated: boolean
}) {
  const style = Object.fromEntries(
    Object.entries(tokens).map(([token, value]) => [`--${token}`, value])
  ) as React.CSSProperties

  return (
    <section className="rounded-2xl bg-card p-6 shadow-xs">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={!generated}>
          {generated ? "Refresh" : "Generate Preview"}
        </Button>
      </div>

      {generated ? (
        <div
          style={{ ...style, fontFamily: fonts.body ? `'${fonts.body}', sans-serif` : undefined }}
          className="mt-6 flex flex-col gap-5 rounded-xl bg-background p-6 text-foreground"
        >
          <h2
            className="text-3xl"
            style={{ fontFamily: fonts.primary ? `'${fonts.primary}', sans-serif` : undefined }}
          >
            The quick brown fox
          </h2>
          <p
            className="text-base"
            style={{ fontFamily: fonts.emphasis ? `'${fonts.emphasis}', serif` : undefined }}
          >
            Emphasis face — jumps over the lazy dog.
          </p>
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
        <p className="mt-6 text-sm text-muted-foreground">
          Generate a palette, then preview it against real components.
        </p>
      )}
    </section>
  )
}
