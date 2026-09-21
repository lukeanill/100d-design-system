# Theme studio

The theme studio is the visual editor for this design system's colour themes.
Pick four seed colours and three fonts, and it derives the full token palette,
writes the theme, regenerates `tokens.css` and updates the registries the app
renders from.

It runs in two places.

| | Where it saves | How the site updates |
| --- | --- | --- |
| **Deployed** — `https://www.lukeai.space/themes` | A commit on `master` | Vercel redeploys automatically, ~1–2 minutes |
| **Local** — `http://localhost:5173/themes` | Your working copy | You commit and push |

Both are password-gated and both refuse every request until a password is set.

## Using the deployed studio

Open `/themes` on the site, enter the password, edit, save. The save becomes a
commit, Vercel builds it, and the site picks it up a minute or two later. The
studio says so when it saves rather than implying the site has already changed.

Nothing to install, and it works from any browser.

### One-time setup

The deployed studio needs two environment variables in the Vercel project
(**Settings → Environment Variables**, Production scope):

| Variable | What it is |
| --- | --- |
| `THEME_STUDIO_PASSWORD` | Any password you choose. Without it the studio refuses everything. |
| `THEME_STUDIO_GH_TOKEN` | A GitHub token so it can commit. Without it you can browse themes but not save. |

For the token, create a **fine-grained personal access token** at
<https://github.com/settings/personal-access-tokens/new>:

- **Repository access** → only `lukeanill/100d-design-system`
- **Permissions → Repository permissions → Contents** → **Read and write**

That is the only permission it needs. Nothing else is required, and the token is
only ever read on the server — it never reaches the browser.

Two optional variables exist if you ever need them: `THEME_REPO` (defaults to the
repo the deployment came from) and `THEME_BRANCH` (defaults to the production
branch).

## Using the local studio

```bash
cp apps/web/.env.example apps/web/.env.local   # then set THEME_STUDIO_PASSWORD
pnpm install
pnpm --filter web dev
```

Open <http://localhost:5173/themes>. Saves land in your working copy — run
`git status` to see them, then commit and push to get them onto the site.

Use the local studio when you want to explore, since nothing you try is
published until you push. Use the deployed one when you know what you want.

## The contrast gate

CI fails on any theme that introduces a **new** contrast shortfall, so a theme
that trips the gate would produce a red build and a site that silently keeps
showing the old themes.

Contrast is a warning, not a veto. It is your design system; some pairs cannot
even be fixed by lightness, because the foreground is already at 100%.

- **Deployed** — a save that drops below a rule shows you the exact failing
  pairs and asks once. Choosing *Keep them and save* records those numbers in
  `.contrast-baseline.json` in the same commit, so the build stays green and the
  theme actually deploys. It has to ask before committing rather than after: a
  commit without those numbers goes red in CI and never reaches the site, so the
  save would report success and change nothing.
- **Local** — nothing blocks, because nothing is published until you push. The
  studio tells you to run `tokens:check --update-baseline` before pushing;
  skipping that is what makes CI reject the branch later.

Accepting a shortfall is never silent. The numbers stay in the baseline file and
in the diff, and the gate still fails on its own if a recorded pair gets worse.

Existing shortfalls are recorded in `packages/ui/tokens/.contrast-baseline.json`
and only fail if they get worse. A **new** theme has no baseline, so it has to
pass all the rules outright — including a theme copied from an older one that
carries baselined shortfalls of its own.

To check locally before pushing:

```bash
pnpm --filter @workspace/ui tokens:check
```

## How it fits together

```
        studio UI (browser, derives the palette)
                       │
        ┌──────────────┴──────────────┐
   dev server                   /api/themes
   (theme-studio-plugin.ts)     (apps/web/api/themes.mjs)
        │                             │
        └────────────┬────────────────┘
                     │
            applyThemeChange()          packages/ui/scripts/core/
                     │
   tokens/<name>.json · tokens.css · theme-registry.ts · font-theme-registry.ts
                     │
        working copy          one commit → Vercel build → site
```

Both APIs are thin: they read a workspace, hand it to `applyThemeChange`, and
persist whatever files come back. Only the storage differs. That is what keeps a
local save and an online save producing identical results.

`packages/ui/scripts/core/` is covered by `pnpm --filter @workspace/ui test`,
which CI runs — the hosted studio commits through this code without a human
reading the diff first, so it is tested rather than trusted.

## A note on `vercel.json`

The SPA rewrite's `source` is **path-to-regexp**, not a raw regular expression.
A bare lookahead (`/((?!storybook).*)`) silently matches nothing rather than
erroring, which is why `/tokens` and `/history` used to 404 in production while
`/` worked. The pattern has to hang off a named parameter:

```json
{ "source": "/:path((?!api/|storybook).*)", "destination": "/index.html" }
```

This file lives in `apps/web`, not at the repo root, because that is the
directory Vercel builds this project from — the build command's relative paths
(`cp -r storybook-static/. dist/storybook/`) only resolve from there. It has to
carry the build settings as well as the rewrite: a `vercel.json` holding only
rewrites drops the rest to the dashboard's settings, which point at a different
output directory and fail the build.

## Files

| Path | What it does |
| --- | --- |
| `apps/web/src/theme-studio/` | The editor UI |
| `apps/web/api/themes.mjs` | Deployed API — commits to the repo |
| `apps/web/vercel.json` | Build settings and the SPA rewrite |
| `apps/web/theme-studio-plugin.ts` | Local dev API — writes to your working copy |
| `packages/ui/scripts/core/` | The shared logic both APIs call |
| `packages/ui/tokens/*.json` | One file per theme; the source of truth |
| `packages/ui/src/styles/tokens.css` | Generated — never hand-edit it |
