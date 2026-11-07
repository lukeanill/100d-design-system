# Where the system is used

What is verified from this repo, and what is not.

## Built with it (verified in source)

| Site / surface | Where | Notes |
|---|---|---|
| **Design system site** | https://ds.lukeai.space (`apps/web`) | Homepage `/` (always Berghain), Themer `/themes`, Tokens `/tokens`, History `/history`. Source in `apps/web/src`. |
| **Storybook** | https://ds.lukeai.space/storybook/ (dev: http://localhost:6006) | Every component and animation story; theme switcher in the toolbar. |
| **Themer product preview: "Coeurdes Alpes"** | `apps/web/src/themer/ProductPreview.tsx` | A product page drawn with the real components at half size, reading the draft theme. The best "in context" example of the whole system. |
| **Homepage tiles and install drawer** | `apps/web/src/Showcase.tsx`, `LinkTile.tsx` | LinkTile + Popover + GlassLayer; Drawer for the install panel. |
| **Slopes phone demo** | `apps/web/src/SlopesPhone.tsx` | A phone mock-up used on the homepage preview. |
| **Explore** | `apps/web/src/explore` | Menus and pieces gallery. |
| **QA app** | `qa/` (http://localhost:5174/qa/run) | Internal tool built on `@workspace/ui`. |

Per-component usage ("Used in web app" and "Used by other components") is in `components.md` and the detail files; it is computed from imports, so it is exact for this repo.

## Sites the homepage presents as made with it

`apps/web/src/Preview.tsx` links these as examples (the homepage names them; their source is not in this repo):

| Site | URL | Homepage label |
|---|---|---|
| Slopes | https://slopes.lukeai.space | "Slopes map" (drawn with `SlopesPhone`) |
| Good nudge | https://goodnudge.lukeai.space | "Good nudge guidance" |
| Birth chart | https://chart.lukeai.space | "Birth chart horoscopes" |

Which individual components each uses cannot be known from here.

## External consumers (not verifiable here)

- **LASC**: `packages/ui/scripts/build-publish.mjs` names it as the standalone consumer the `@lukeanill/ui` package is built for.
- Other Vercel projects on the same team (`lukeportfolio`, `aiguides`, `property`, `bz`) may use the package, but nothing in this repo says so. Do not claim a component is used in them without checking that project's source; ask Luke.
