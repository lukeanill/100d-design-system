# Handover — theme settings work

_Last updated 2026-10-09._

## State of the repo

Working tree clean. Local `master` is **one commit ahead of GitHub**: `bc583ec`
"Theme: Mozart, and semibold headings" (yours, 2026-10-07 — adds the Mozart
theme and semibold 600 as a heading weight). It is unpushed, so it is not live.
Everything below it is pushed and deployed.

Work only in `/Users/luke/100d/design-system`. The sibling `100d` folders
(`design-system-archive`, `design-system-transitions`) are stale clones of the
same repo, fully contained in `master`.

## What shipped

Five commits, `9d97ee2` → `ad40ceb`. A theme now carries, beyond its colours
and fonts:

| Setting | Options | Default |
|---|---|---|
| Surface | Solid / Glass, with weight, colour and which groups it covers | Solid |
| Heading font | Primary or Secondary, per H1–H6 | Primary |
| Heading weight | 300/400/500/700, Google-font themes only | 400 |
| Type scale | Current, Compact (60→18px), Classic (76→19px) | Current |
| Page transition | Fade, Blinds, Curtain, Iris | None |
| Background | Smoke, Holo, Aurora, 80, ASCII | None |
| H1 gradient | On, with two colour tokens | Off |

Where each lives:

- **Theme JSON** (`packages/ui/tokens/<name>.json`) is the source of truth, and
  a setting is stored only when it differs from the default.
- **`tokens.css`** gets glass, heading typography and the H1 gradient as custom
  properties inside each theme's generated block.
- **`theme-registry.ts`** gets the transition and the background, because those
  choose a React component.
- `packages/ui/scripts/core/theme-settings.mjs` holds the tables, the
  validation and the CSS emitters, shared by the generator and the studio so a
  preview cannot drift from the stylesheet.
- The studio's panels are `apps/web/src/theme-studio/ThemeSettings.tsx`.

The eleven existing themes were seeded with what they already rendered (three
backgrounds, the H1 gradient every theme had from the Showcase), so the site
did not change when this landed.

## Bugs fixed on the way

- Google-font themes never applied their declared heading and emphasis faces —
  Bumblebee rendered Authentic Sans rather than Work Sans.
- The studio preview showed the studio's own colours and fonts instead of the
  theme being edited.
- A registry entry kept an effect after the theme turned it off.
- Two studio edits in the same frame could cancel each other out.

## Two things worth knowing

**A `var()` inside a custom property resolves where the property is declared,
not where it is used.** `--glass-card-surface: var(--card)` at `:root` freezes
whichever theme the page is on, which is what broke the preview. Group classes
now resolve their own surface on the element. The same rule applies to the font
aliases (`--font-heading`), which is why the preview sets them itself.

**The dev studio writes straight to your working copy.** A stray drag in the
theme list sends a real reorder and renumbers every theme. If `order` churn
appears in `git status` without explanation, that is where it came from.

## Open threads

- **Showcase sample content.** You asked to replace the "Fulfillment report,
  Q3" demo; the questions about what it should become, and whether the layout
  can change, are unanswered. Nothing started.
- **Glass on menus.** Menus, selects and dropdowns were already glass before
  this work. Unticking Selects/Overlays currently keeps that look, and ticking
  retunes the group to the theme. The alternative — unticked means solid —
  would change every menu in all eleven themes.
- **Not verified on the live site:** saving a theme through the hosted studio
  (it needs your password). Worth trying glass on a theme that also has a
  background, and a page transition across `/`, `/tokens` and `/history`.

## Checks

```bash
pnpm --filter @workspace/ui tokens:build --check
pnpm --filter @workspace/ui test
pnpm --filter @workspace/ui tokens:check
pnpm typecheck
pnpm --filter web exec vitest run --project storybook
```

All passing as of `ad40ceb`: 49 unit tests, 184 story tests.
