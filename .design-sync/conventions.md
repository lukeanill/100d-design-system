## Wrapping and setup

Every screen must be wrapped in `ThemeProvider` (from `@workspace/ui/components/theme-provider`). It puts the active theme's class on `<html>`, and every colour, font, radius and shadow token follows from that class, so **skipping it renders components with no tokens at all**. It must wrap the whole app, not individual components:

```tsx
import { ThemeProvider } from "@workspace/ui/components/theme-provider"

<ThemeProvider forcedTheme="berghain">
  <App />
</ThemeProvider>
```

This design system ships **9 named themes** — `berghain` (the default), `fabrik`, `illuzion`, `laroc`, `bootshaus`, `savaya`, `pacha`, `amnesia`, `ushuaia` — each a complete look: colours, fonts, radius, shadows and surface. Pass one as `forcedTheme`, or omit it to get `berghain`. They are defined in `@workspace/ui/themes`. A theme someone made in the Themer is a single CSS file: import it after the design system's styles and pass its id as `forcedTheme`.

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

## Motion

Every motion on a component follows Material Design's guidance on **choosing a duration**, and takes its duration from the **Timing** variables and from nowhere else (`instant` 0ms, `fast` 200ms, `faster` 400ms, `long` 800ms, `longer` 1200ms, `longest` 2400ms; the `--duration-*` tokens). Never write a duration of your own.

How to choose:

- **Size and distance decide it.** The smaller the element and the shorter it travels, the shorter the motion. A small thing changing in place (a hover or press fill, a toggle, an icon swap) is `fast`. A medium thing that appears, grows or slides (a menu or popup opening, a tab indicator moving, a panel expanding) is `faster`. A large thing, or choreography across several elements (a full-width panel, a page-level change), is `long`. `longer` and `longest` are for ambient or decorative motion, never for something a person is waiting on.
- **Leaving is quicker than arriving.** Something dismissing or collapsing takes one step shorter than the same thing appearing (a popup that opens in `faster` closes in `fast`).
- **Utility never makes people wait.** Anything a person triggers and then waits on (a hover, a click, a menu) stays at `faster` or shorter.
- **No motion is a valid answer.** If a state change does not need to be noticed as a movement, use `instant`.
- **The theme's motion setting (none, ease, emphatic, springy) supplies the easing, not the duration.** Use the theme's curve (`--motion-transition-ease`) with the duration you chose from the Timing set. A theme set to `none` gets `instant`.

**Exception:** where the animation is the component's core identity, such as the metal effect, whose motion is the point of it, it keeps its own timing.

## Elevation

Every shadow on a component follows Material Design's guidance on **applying elevation**: elevation shows which surface sits above which, so it is applied by hierarchy, in as few levels as will do, and never for decoration.

- **Only the design system's shadow tokens.** Use `shadow-xs`, `shadow-sm`, `shadow-md` and `shadow-lg` (the `--shadow-*` tokens). Never write a shadow value, a colour or an offset by hand, and never use a drop shadow filter for elevation.
- **The theme decides how strong it is.** The tokens already resolve to the theme's shadow setting: subtle, strong, or `none`. A theme with no shadow setting has no shadow anywhere, so a component must not add one back (no borders or rings standing in for it either).
- **A popup sits one level above the component that opens it.** If the component is `shadow-xs`, its menu or popover is `shadow-sm`; if it is `shadow-sm`, the popup is `shadow-md`. The scale stops at `shadow-lg`: a popup from a component already at `lg` stays at `lg`.
- **Resting level follows the surface's role.** A control at rest sits low; a surface raised above the page sits higher; anything that floats over the page (menus, popovers, dialogs) is above whatever opened it. Pick the lowest level that still separates it from what is behind.
- **State is not elevation.** Hover, press and focus change the background with an alpha overlay (`--control-hover`) and never the shadow level or the text and icon colour.

## Flagship Components

Three components are the reference implementation of this design system's theming: the **nav bar** (`FluidTabs`), the **prompt bar** (`PromptBar`, with the menus it opens) and the **metal buttons** (`ControlButton` with `metal`). They were tuned together until they look and move as one family under every theme. When another component is themed, or an old one is brought up to date, it is held to the principles below, and these three are what to compare it against.

The principles are written as rules a component can be checked against. Numbers are the token values today; the rule is the token, never the number.

### Two settings drive almost everything

A theme describes itself with several settings, and two of them do most of the work here. They are independent, and mixing them up is the most common mistake.

- **Color-mode** (light or dark, the Figma's `settings/color-mode`) is the colour of the page and the text. It decides the **lines**, the **hover** and the **fill**. A light theme draws lines and hovers in dark washes; a dark theme draws them in light washes.
- **Texture** (solid, gradient or glass) is what the surface of a component is made of. Texture and color-mode decide the **fill**, and nothing else. There is no separate tone: a dark color-mode has a dark surface and a light one a light surface.

The system's own tokens are the only source of every value. The washes come from the `alpha` collection, which has a dark wash and a light wash, each stepped `xs` `sm` `md` `lg` `xl` (dark: 4, 8, 16, 32, 80%; light: 6, 12, 24, 48, 96%). The blurs come from `alpha/blur`. The corners come from `radius`. The shadows come from `shadow`. Durations and easing come from `motion`.

### 1. Fill: texture × color-mode

The fill is the surface of the component, behind its content and inside its line. It is set by the theme's texture and color-mode, and by nothing the component chooses.

| Texture | Dark color-mode | Light color-mode |
|---|---|---|
| **Solid** | The card colour with a dark wash of `alpha/dark/xs` over it. | The card colour with a light wash of `alpha/light/sm` over it. |
| **Gradient** | A vertical gradient from `alpha/dark/md` (top) to `alpha/dark/lg` (bottom). | The same gradient in the light wash: `alpha/light/md` to `alpha/light/lg`. |
| **Glass** | The **Soft** glass from the Glass sheet, in its dark tone. | The Soft glass in its light tone. |

How each one behaves:

- **Solid** is opaque. The wash only nudges the card colour a step, so the component sits just apart from the page. The dark wash on a solid fill is always `xs` (anything heavier made light-scheme solids too dark); the light wash is `sm`.
- **Gradient** is translucent from the top, so the page shows through and the component reads as lit from above. The gradient is made of washes, not of card colours, so it works on whatever is behind it.
- **Glass** has no fill colour of its own. The glass layer is the surface: it blurs and refracts what is behind it. A glass component must therefore have something behind it to refract, and its corners are read from the component so the glass follows the shape.

### 2. Lines: one rule, follows color-mode

The **outer shell** of a component always has a 1px line. Any other line a component has, such as a divider between sections or the outline of a popup it opens, takes the same colour. Inner elements (a tab, a button, a menu row) do not get a line of their own. One rule covers all of them:

- **Width:** 1px.
- **Colour, by color-mode:** a **light** color-mode uses `alpha/dark/xs`; a **dark** color-mode uses `alpha/light/xs`. This is the `--control-edge` token.
- **Position:** the line is drawn **centred on the edge** of the component (an outline pulled in by half its width), so it never takes any of the padding. Padding and corners are worked out as if the line were not there.
- **Glass has no line.** The glass layer's own edge and highlight are the edge, so a glass component draws none, and a divider inside a glass component is not drawn either.
- **Where the line is part of the effect, it is left alone.** The metal ring is the clearest case. A metal component on a light scheme may put a darker line just outside the ring so the ring reads against a pale surface.
- **A state never recolours a line.** Hover, focus and press leave it as it is. If focus needs showing, it is a separate ring, not a darker border.

### 3. Hover and other states

- **A state changes the background and nothing else.** It adds a translucent wash over the fill. It never changes the colour of the text or an icon, never changes the line, and never changes the shadow.
- **Wash by scheme:** a light scheme adds `alpha/dark/sm`; a dark scheme adds `alpha/light/sm`. This is the `--control-hover` token. The same wash works on solid, gradient and glass alike, because it is added on top.
- **Timing:** a hover uses the Timing step `fast` with the theme's easing, as set out in Motion. A theme whose motion is `none` changes instantly.

### 4. Corners: inner first, then outer

Corners are concentric: the outer corner is derived from the inner corner, never chosen on its own.

- **The inner corner is the theme's `radius/sm` step** (`--radius-button`). Anything that sits inside a padded component (a tab, a button, a menu row, a chip) wears it. The themes fall into four groups:

  | Radius | Inner corner |
  |---|---|
  | Sharp / none | 0px |
  | Subtle | 4px (`radius/sm`) |
  | Strong | 8px (`radius/sm`) |
  | Rounded | 9999px, a pill (Figma's `radius/button`; its `sm` step is 16px, but rounded inner elements are always pills) |

- **The outer corner is the inner corner plus the padding of the outer component.** The line is not counted. On a strong theme, a component with 4px of padding has 8 + 4 = 12px outside.
- **It never goes past the theme's outer maximum** (`--radius-outer-max`): 0 on sharp, so a sharp theme stays square whatever the padding; the theme's radius on subtle and strong; and 9999px on rounded, so a rounded theme is a pill inside and out.
- Never take a fixed amount off the outer corner to get the inner one.

### 5. Size and spacing

- **Height is the inner element plus the padding on both sides.** It is not a fixed number. A component whose inner row is 36px with 4px of padding is 44px (this is where the nav bar, prompt bar and metal buttons get 44px from); a component with bigger inner elements or more padding is taller. Choose the inner element's size first.
- **Padding is always an even number, at least 4px.** Odd padding breaks the corner maths and the centring.
- **Inputs get double padding.** An input field inside a component has twice that component's padding at the sides (8px inside 4px padding; 28px inside 14px).
- **Controls that must stay a fixed height** (a one-line bar) keep their text centred in its row by line height, so a theme's line height can change without changing the height.

### 6. Content: type and icons

- **Text** uses one style, Figma's `body/sans/md/regular`: the theme's body font and weight, with the theme's own line height and letter spacing. Do not set a size, weight or tracking on text in a component. The weight in particular comes from the theme's `Font/Sans/weight` (a light theme body is Light, 300): hard-coding a medium or semibold weight is why a component reads heavier than its Figma example.
- **Icons** are Phosphor only, at the theme's icon weight, each inside a 20 × 20 box, so every theme changes the icon's weight and nothing else.
- **Default content comes from the Figma reference.** A component's demo labels, icons and copy match the Figma example it was built from (the nav bar is Look, Feel, Rules with Swatches, Scribble and Film Script icons), so the code and the design show the same thing.
- **Colour:** text and icons use the theme's foreground (and a softer step of it for secondary text). They do not change on hover.

### 7. Popups

A popup is anything a component opens over the page: a menu, a popover, a dropdown. The rule is that a popup is **one step above** the component that opens it, in every dimension:

- **Elevation.** One shadow level higher than the component (as set out in Elevation).
- **Fill.** The component's own fill (section 1) with a dark wash of `alpha/dark/sm` on top, on every texture and scheme. **Glass is the exception:** it has no wash; it uses the **next glass weight up** (the component's Soft becomes Medium; Medium becomes Heavy; Heavy stays Heavy).
- **Blur behind it.** A heavy blur of whatever is behind the popup, from the `alpha/blur` variables at the `sm` step, chosen by the page width: under 1200px wide it is `alpha/blur/320/sm` (40px), and from 1200px wide it is `alpha/blur/1200/sm` (120px).
- **Padding.** At least 8px, always even.
- **Corners.** The rows inside wear the inner corner (section 4), and the popup's own corner is that plus its padding, capped at the theme's radius.
- **Width.** At least half the width of the component that opens it. A menu that lists long names is wider than that, never narrower.
- **Lines.** The popup's outline and any divider follow section 2.
- **Links and ghost buttons inside a popup** use the `primary` colour as their background and `primary-foreground` for their text. They are small buttons, not coloured text, so they hold their contrast on every fill.
- **Motion.** A popup opens and closes by the Motion rules, medium-sized and arriving (a step longer to arrive than to leave).

### 8. Motion and elevation

These two have their own sections above and apply in full. In short: durations come only from the Timing set, chosen by size and distance, with the theme supplying the easing; a theme set to `none` gets `instant`. Shadows come only from the shadow tokens, resolve to the theme's strength (or none), and are never used to show a state. The one exception is a component whose animation is its identity (the metal effect), which keeps its own timing.

### 9. Metal buttons

The metal effect keeps its own ring and its own motion, and everything else about a metal button follows this section as any other control does.

- **The fill must never hide the effect.** The fill under the ring comes from the theme (section 1) and is translucent. A solid white or other opaque fill under the metal makes the effect impossible to see; the original Metal component uses a translucent background for this reason.
- **The effect is always on and alive.** Metal controls that sit together show the same effect, run the same halo and are the same height. An effect that does not appear, or stops animating, is a bug in the component, not a style.
- **Corners, text, icon and hover** are the theme's: the hover is the wash from section 3, laid over the fill and under the ring.
- **The ring's own line is the exception named in section 2.** On a light scheme a darker line outside the ring (`alpha/dark/xs`) helps the ring read against a pale surface.

### What each reference shows

- **Nav bar (`FluidTabs`).** The simplest case of fill, line, corners and hover. A 44px track with 4px of padding holds 36px tabs (12px at the sides, a 20px icon, 4px to the label); the active tab is a pill in the foreground colour, and hovering the others adds the wash.
- **Prompt bar (`PromptBar`).** Everything the nav bar has, plus an input (double padding), a text-style set, icon buttons, and popups. Its menus are the reference for section 7: one level up in elevation, the component's fill plus the dark wash (or heavier glass), blurred, 8px padding, concentric rows, a `primary` link-button, and at least half the width.
- **Metal buttons (`ControlButton` with `metal`).** The reference for an effect-led component: a themed fill under a metal ring, in a circle and a pill at the same height, and the one place where the component's own motion replaces the Timing set.

### Checklist for a new component

1. Is every colour, font, corner, shadow and duration a token, with nothing written by hand?
2. Does the fill come from the theme's texture and color-mode, and does it work as solid, gradient and glass, in a light and a dark tone?
3. Do the lines follow the scheme, sit on the edge and disappear on glass?
4. Does hover add only the scheme's wash, with `fast` and the theme's easing?
5. Are the inner corner and the outer corner derived from each other, and does a sharp theme stay square?
6. Is the padding even, at least 4px, with inputs at double?
7. Does every popup sit one step above its component in elevation, fill, blur, padding, corners and width?
8. Does it look right under every theme, and does it still look right when one is switched to another while the page is open?

### Open items

- Motion other than hover (a menu opening, the tab indicator moving) has not been put on the Timing set yet.
- The glass popup blur and the Medium weight read as see-through over busy backgrounds; a Heavy glass popup may be needed for legibility.
