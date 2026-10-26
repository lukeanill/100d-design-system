## Wrapping and setup

Every screen must be wrapped in `ThemeProvider` (from `@workspace/ui/components/theme-provider`). It puts the active theme's class on `<html>`, and every colour, font, radius and shadow token follows from that class, so **skipping it renders components with no tokens at all**. It must wrap the whole app, not individual components:

```tsx
import { ThemeProvider } from "@workspace/ui/components/theme-provider"

<ThemeProvider forcedTheme="berghain">
  <App />
</ThemeProvider>
```

This design system ships **9 named themes** — `berghain` (the default), `fabrik`, `illuzion`, `laroc`, `bootshaus`, `savaya`, `pacha`, `amnesia`, `ushuaia` — each a complete look: colours, fonts, edges, shadows and surface. Pass one as `forcedTheme`, or omit it to get `berghain`. They are defined in `@workspace/ui/themes`. A theme someone made in the Themer is a single CSS file: import it after the design system's styles and pass its id as `forcedTheme`.

## The styling idiom

Tailwind v4 utility classes on semantic CSS custom properties (a shadcn-derived system) — **never hardcode a hex color or an arbitrary utility like `bg-[#fff]`**. Use the semantic family:

| Purpose | Classes |
|---|---|
| Surfaces | `bg-background`, `bg-card`, `bg-popover`, `bg-muted`, `bg-sidebar` |
| Brand/action | `bg-primary` / `text-primary-foreground`, `bg-secondary` / `text-secondary-foreground`, `bg-accent` / `text-accent-foreground` — solid fill + contrast text |
| Status | `bg-destructive`, `bg-affirmative` — tinted, not solid: this DS pairs status colors as a low-opacity wash with matching text, e.g. `bg-destructive/10 text-destructive`, never `text-destructive-foreground` (that class isn't shipped) |
| Text | `text-foreground`, `text-muted-foreground` |
| Borders/rings | `border-border`, `ring-ring` |

These resolve through `--color-*` → `--*` custom properties (122 tokens total) defined in the shipped `tokens.css` — every class above is real and compiled into the shipped CSS, not invented. Chart colors (`--chart-1` … `--chart-5`) exist as the same kind of token but are consumed as raw CSS custom properties (`var(--chart-1)`, e.g. in a recharts series config), not as Tailwind utility classes — no `bg-chart-*`/`text-chart-*` class ships. Components are pill/rounded-heavy (`rounded-full` is common on buttons/badges) — match that geometry when composing raw layout, don't default to sharp corners.

## Where the truth lives

- `styles.css` (root) — import closure entry; pulls in tokens, fonts, and component CSS.
- `tokens/` — the semantic token definitions (`--color-*`/`--*` custom properties) and the 9 theme variants.
- Per component: `<Name>.d.ts` (props contract) and `<Name>.prompt.md` (usage doc, generated from the component's own JSDoc + props) — read both before composing with an unfamiliar component.

## One idiomatic build snippet

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"

<Card className="bg-card border-border">
  <CardHeader>
    <CardTitle className="text-foreground">Order #1042</CardTitle>
    <Badge className="bg-affirmative/10 text-affirmative">Paid</Badge>
  </CardHeader>
  <CardContent className="text-muted-foreground">
    <Button className="rounded-full">View details</Button>
  </CardContent>
</Card>
```
