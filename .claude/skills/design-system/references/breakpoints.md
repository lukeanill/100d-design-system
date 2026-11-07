# Breakpoints

The design system does not define custom breakpoints in `tokens.css` (no `--breakpoint-*`). It uses Tailwind v4's defaults plus a handful of fixed widths in code. Verified against source; re-check with the greps at the end if the code has moved.

## Tailwind defaults (min-width, mobile first)

| Prefix | Width | Used (approx. class count in `packages/ui/src` + `apps/web/src`) |
|---|---|---|
| `sm:` | 640px | ~137 (most common) |
| `md:` | 768px | ~33 |
| `lg:` | 1024px | ~19 |
| `xl:` | 1280px | rare |
| `2xl:` | 1536px | rare |
| `max-sm:` | below 640px | ~17 |

## Fixed widths in code

| Width | Where | What changes |
|---|---|---|
| **768px** | `packages/ui/src/hooks/use-mobile.ts` (`useIsMobile`, `MOBILE_BREAKPOINT = 768`; a copy in `apps/web/src/hooks`) | Mobile is `max-width: 767px`. The Sidebar switches to its sheet on mobile. |
| **1200px** | `packages/ui/src/styles/tokens.css` | `--popup-blur` goes from `--alpha-blur-320-sm` (40px) to `--alpha-blur-1200-sm` (120px) at `min-width: 1200px`. The Figma names the two blur tokens by page width, 320 and 1200. |
| **1100px** | `apps/web/src/Showcase.tsx`, `Preview.tsx` | `min-[1100px]` / `max-[1099px]`: the homepage layout. |
| **1000px** | `apps/web/src/explore/Explore.tsx` (`MIN_WIDTH`) | Explore goes wide. |

## Container queries

Components that adapt to their parent rather than the viewport: `@container/field-group` (Field), `@container/card-header` (Card), `@container/wrapper` (Management Bar).

## Fluid sizing

The homepage is built to the Figma HOME frame: a 1280 frame with a 1040px column, sizes in `clamp()` (for example `px-[clamp(20px,9.375vw,120px)]`). Prefer `clamp()` over adding a breakpoint when matching a Figma frame.

## Media features also used

`prefers-reduced-motion: reduce` (tokens.css, ai-keyframes.css, ThemePageTransition, VoiceRing, GradientBackground, Click), `prefers-color-scheme` (GradientBackground), `pointer: coarse` (ImageZoom, Magnetic).

## Re-check

```bash
grep -rn "MOBILE_BREAKPOINT\|min-width\|min-\[\|max-\[" packages/ui/src apps/web/src --include='*.ts' --include='*.tsx' --include='*.css' | grep -v stories
```
