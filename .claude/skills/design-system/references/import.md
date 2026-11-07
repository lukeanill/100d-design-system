# Importing a component

Use this whenever a new component is about to enter `packages/ui`: from the shadcn registry, the Animate UI registry, another repo, a Figma export, or written fresh. The aim is that it looks and moves like it was always part of the system, in every theme.

## Step 0. Ask first

Do not start an import unprompted. If the user mentions a component that is not in `components.md`, or asks for a new one, ask (AskUserQuestion), one short question with these answers:

1. "Do you want me to import it into the design system?" (Import it / Just build it in the app / Not now)
2. Only if importing: where it comes from (shadcn registry, `@animate-ui`, a URL or repo, Figma, written fresh) and which Storybook group it belongs in.

Importing changes `packages/ui`, which the web app, Storybook, the QA app and the published `@lukeanill/ui` all read. Never do it as a side effect of another task.

## Step 1. Find what already exists

Search `references/components.md` and `references/animations.md` (and `packages/ui/src/components`) for the same job. If something close exists, extend or compose it instead of importing a second version. Say which existing parts you will reuse (Button, Badge, Card, GlassLayer, ThemedIcon, `useThemeTransition`, ...).

## Step 2. Bring it in

- shadcn: `pnpm dlx shadcn@latest add <name> -c apps/web`; Animate UI: `pnpm dlx shadcn@latest add @animate-ui/<name> -c apps/web`. Files land in `packages/ui/src/components` (style `base-maia`, icon library Phosphor, aliases `@workspace/ui/...`; config `packages/ui/components.json`).
- Keep one file per component where the repo does; put it in the folder that matches its kind (`ai/`, `transitions/`, `fancy/text/`, `animate-ui/...`, `ui/`).
- Import with `@workspace/ui/...` aliases, never relative paths into other packages. New dependencies go in `packages/ui/package.json`.
- Do not leave a duplicate behind (the repo already removed Core duplicates in favour of the animate-ui versions).

## Step 3. Make it theme-cohesive (the checks)

Work through every line against the code. Each item names the token to use; `guidance.md` §2 has the rule numbers, `tokens.md` the values.

| Check | Do this | Search for these to find violations |
|---|---|---|
| Colour | Semantic tokens only: `bg-background`, `bg-card`, `bg-primary text-primary-foreground`, `text-muted-foreground`, `border-border`, `ring-ring`, `bg-destructive`. Status as a tinted wash, e.g. `bg-destructive/10 text-destructive` | `#`, `rgb(`, `hsl(`, `bg-white`, `bg-black`, `zinc-`, `slate-`, `gray-`, `neutral-`, `bg-[` with a colour |
| Text | `text-md`, `text-action-md`, `text-label-md`, `text-h3-pri`, ... never a pixel size, weight or letter spacing of its own; fonts via `font-heading`, `font-sans`, `font-serif` | `text-[`, `font-[`, `tracking-[`, `leading-[`, `font-bold` where a style exists |
| Radius | Controls and inner elements `rounded-(--radius-button)`; cards and surfaces `rounded-lg`/`rounded-md` etc. Outer corner = inner + padding, capped at `--radius-outer-max`. Never a fixed `rounded-xl` that ignores the theme | `rounded-[`, `rounded-full` on a card, `border-radius:` |
| Shadow | `shadow-xs` ... `shadow-2xl` only; a popup one step above its trigger | `shadow-[`, `drop-shadow-`, `box-shadow:` |
| Surface | Solid/gradient: `bg-card` (it paints `--card-image`) and `--control-fill` for controls. Glass: `glass("card" \| "action" \| "input" \| "select" \| "overlay" \| "dialog")` from `lib/glass`, or `GlassLayer`/`LiquidGlass`. Never a hand-made blur | `backdrop-blur`, `backdrop-filter`, `blur-[`, `bg-white/`, `bg-black/` |
| Border and lines | `--control-edge` / `border-border`; glass themes have no border | `border-white`, `border-black`, `border-[#` |
| Hover / press | Background only: `--control-hover` or the alpha washes; never change text, icon, border or shadow colour on a state | `hover:text-`, `hover:border-`, `hover:shadow-` |
| Motion | CSS: `duration-(--motion-fast) ease-(--motion-transition-ease)` (or `--motion-duration` / `--motion-ease` for larger moves). `motion` library: `useThemeTransition()` / `useThemeSpring()`. Popups open at `--duration-faster`, close at `--duration-fast`. `motion=none` must be instant; respect reduced motion | `duration-[`, `ease-[`, `transition={{`, `duration:`, `cubic-bezier(`, `animate-` with a literal time |
| Icons | Phosphor via `ThemedIcon` so the theme's icon weight applies; icon box from the `icons/container` token | `lucide-react` imports, fixed `size-` on icons that ignore the box |
| Size and spacing | Min height/width from the `size-controls` tokens; padding even numbers; an input inside a component has double its side padding. Theme `spacing` only affects layout between components | odd `p-`/`px-` values, `h-[`, `w-[` |
| Colour mode | One `color-mode` per theme decides light/dark tokens (alpha-dark vs alpha-light). Prefer these tokens over per-component `dark:` forks | `dark:` |
| Sub-components | Build on the system's own parts (Button, Badge, Card, Input, ...) instead of redrawing them | re-implemented buttons, badges, cards |
| Exceptions | If the component must differ because the effect is its purpose (like metal), say so and keep the exception narrow (rule 1.1.3) | |

Any case the tokens cannot express: do not fake it. Report it as a gap (rule 13.1.1) and ask Luke whether to add a token.

## Step 4. Add the story

Create `<name>.stories.tsx` next to the component. Title it into the Storybook taxonomy (sidebar order is set in `apps/web/.storybook/preview.tsx`): `Components/<Actions|Inputs|Selects|Navigation|Overlays|Feedback|Content|Layout|AI|Voice>/<Name>`, `Special FX Components/<...>`, or `Animation/<Page Transitions|Text/<Hover|Loops|Numbers|Reveal|Underlines>|Interactions|Transitions|...>/<Name>`. Look at a neighbour story and copy its shape. Export the states a user can reach (default, each variant and size, disabled, loading, open/closed), written from the component's real behaviour, not only from the props.

## Step 5. Verify in the browser, across themes

Start Storybook (`preview_start` "stories", or `pnpm --filter web stories`) and open the story in the full UI (`/?path=/story/<id>`, never the bare `iframe.html`). Use the toolbar theme switcher. Check at least this set, which together covers every value of every setting:

| Theme | Why |
|---|---|
| Fabrik | light, sharp, solid, subtle shadow, emphatic motion |
| Laroc | dark, rounded, solid, no shadow, **motion none**, small scale |
| Pacha | light, rounded, **springy**, large scale |
| Bootshaus | dark, strong radius, **glass**, strong shadow, large scale |
| Amnesia | dark, rounded, **gradient**, subtle shadow |
| Berghain | the default; subtle radius, glass |

For each: colours, font, radius, shadow, spacing, icon weight and motion all follow the theme. Hover, focus, open and disabled states. Resize across 640, 768 and 1200px (see `breakpoints.md`). Anything meant to work on phones also follows `mobile-web-guidelines.md` (44px touch targets, hover only on hover devices, 16px inputs, safe areas, no horizontal scroll at 320px). Then `pnpm typecheck` and `pnpm lint`, and `pnpm --filter web exec vitest run --project storybook`. For a formal pass use the QA app (`/qa-run`), which only tests and never edits components.

## Step 6. Close out

1. Run `node .claude/skills/design-system/scripts/generate.mjs` so this skill lists the new component, its props and its story link.
2. If you introduced a token or exception, record it in `docs/component-theming-guidelines.md` as a numbered rule (a `?` point if Luke has not answered).
3. Report: what you reused from the system, what is new and why, what you tested and what you did not. Then ask the user to QA, with the Storybook URL and what to look at. Do not publish `@lukeanill/ui` or push unless asked.
