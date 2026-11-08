# Tech stack

Versions are the ranges in `package.json` at the time of writing; read the file for the exact current one.

## Repo and tooling

| Area | Choice |
|---|---|
| Monorepo | pnpm workspaces (`pnpm@10.33.4`) + Turborepo. Workspaces: `apps/web`, `packages/ui`, `qa`. Node ≥ 20 |
| Language | TypeScript (~6), strict |
| Build | Vite 8 (`apps/web`, `qa`); `packages/ui` is built with `tsc` + `scripts/build-publish.mjs` |
| Lint / format | ESLint 10 (typescript-eslint, react-hooks, react-refresh), Prettier with the Tailwind plugin |
| Tests | Vitest (unit + Storybook project) with Playwright browser mode; Chromatic for visual review |
| Docs / workbench | Storybook 10 (`@storybook/react-vite`, addon-vitest) at `apps/web/.storybook`, stories from `packages/ui/src/components/**/*.stories.tsx` |
| QA tool | `qa/` app (Vite, port 5174) that grades components per theme; driven by the `/qa-run` skill |

## UI stack

| Area | Choice |
|---|---|
| Framework | React 19 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`, `@theme inline`, `@custom-variant dark`), `tw-animate-css`, class-variance-authority, clsx, tailwind-merge (`cn()` in `lib/utils`) |
| Headless primitives | `@base-ui/react` (shadcn style `base-maia`, config in `packages/ui/components.json`), plus `cmdk`, `vaul` (Drawer), `embla-carousel-react`, `input-otp`, `react-day-picker`, `react-resizable-panels` |
| Component sources | shadcn CLI 4 and the `@animate-ui` registry (`https://animate-ui.com/r/{name}.json`) |
| Motion | `motion` 13 (Framer Motion's successor); CSS transitions read the `--motion-*` tokens |
| Effects | `metal-fx` (v1 and v2), `border-beam`, `thinking-orbs`, `voice-glow`, `three` |
| Icons | Phosphor (default, `@phosphor-icons/react`), Lucide available (`lucide-react`) |
| Charts / maps / code | recharts 3.8, leaflet + react-leaflet, shiki |
| Validation | zod 4 |
| Colour | oklch throughout; hex palettes are converted by `themes/color.ts` |
| Fonts | `@fontsource` (Inter, Bricolage Grotesque, Fira Code) and bundled `@font-face` files in `packages/ui/src/styles/fonts`; theme faces not bundled load from Google Fonts |
| Routing (web app) | react-router 8 (`/`, `/themes`, `/history`) |

## Packaging and hosting

- Internal name `@workspace/ui` (imports like `@workspace/ui/components/button`, `@workspace/ui/themes`, `@workspace/ui/globals.css`).
- Published as **`@lukeanill/ui`** (currently 6.3.x): `pnpm --filter @workspace/ui build` runs `scripts/build-publish.mjs`, which compiles to `dist/`, copies the styles and fonts, rewrites `@workspace/ui/` imports to `@lukeanill/ui/`, and writes the publish `package.json`. Every "go live" also publishes the package, but always ask the user which version number first (say what changed, whether it breaks anything, and recommend one).
- Consumers import the stylesheet and a theme, wrap the app in `ThemeProvider`, and pass the theme id.
- Hosting: Vercel project `100ds`, live at **https://ds.lukeai.space** (also `www.lukeai.space`, `100d-design-system.vercel.app`). The build runs the web app and builds Storybook into `/storybook/` (`STORYBOOK_BASE_PATH=/storybook/`). Repo: `github.com/lukeanill/100d-design-system`.

## Commands

```bash
pnpm install
pnpm --filter web dev            # the site, http://localhost:5173
pnpm --filter web stories        # Storybook, http://localhost:6006
pnpm --filter qa dev             # QA app, http://localhost:5174/qa/run (needs Storybook running)
pnpm typecheck                   # whole repo
pnpm lint
pnpm --filter web exec vitest run --project unit
pnpm --filter web exec vitest run --project storybook
node .claude/skills/design-system/scripts/generate.mjs   # refresh this skill's generated references
```
