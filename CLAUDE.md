# Guidelines

## Always build from the design system, and copy what already exists

1. **Use `@workspace/ui` first.** Before writing any UI, look for the component, token, glass layer, utility or theme setting in `packages/ui` that does the job. Use it as it is. Adapt it only when it cannot express the design, and say why.
2. **Copy patterns and behaviour from what is already built.** Find the closest existing thing (the Themer in `apps/web/src/themer`, the homepage tiles in `apps/web/src/LinkTile.tsx`, `Showcase.tsx`, the Storybook stories) and match how it is built and how it behaves: structure, glass, header, spacing, motion, states. Do not invent a second version of something that exists.
3. **Never fake what the system provides.** No hand-drawn gradients, blurs, shadows, radii or colours that stand in for a token, a glass weight (`GlassLayer`, `LiquidGlass`) or a component. Use literal px values only where the Figma specifies one and no token matches it.
4. **Say which you used.** In each report, list what was reused from the design system or from existing work, and anything built new with the reason.

## Figma

- Read Figma in dev mode: use its CSS and read the annotations (`data-annotations`). Measure the build against the numbers (size, radius, padding, font weight) before calling it done.
- **Figma is read-only unless the user explicitly says to write to it.** Then change only what they explicitly say. Before every write, state exactly what will change (file, page, collection, variable, value) and wait for a clear yes. Add rather than overwrite or delete unless they say so. Afterwards, report what you did and check it. Permission does not carry over: each new change is confirmed again.
- Do not reorder themes. Do not narrow the scope that was asked for.

## Tokens: talk Figma and code, never Tailwind

- **Do not expose the user, or anyone using the system, to Tailwind details.** No Tailwind class names, utility names, `@theme`, `@apply`, config or `--color-*` aliases in reports, questions, page labels or docs. Keep it out of what people see; handle it yourself.
- **What matters is what is in Figma and what is in code.** Describe every token as the Figma variable (collection, name, mode) and the code token (`--name`), and nothing in between.
- **Understand the whole pipeline and check it end to end:** Figma variable → theme data (`packages/ui/src/themes`) → CSS custom property (`--name`) → the framework's alias for it. When asked, verify every step and report gaps as Figma-versus-code gaps.

## Staging and going live

- **`staging` is the test branch.** Vercel builds a preview of it. **`master` is live** (https://ds.lukeai.space).
- Work goes to `staging` first. **When a piece of work is finished and checked, commit and push it to `staging` automatically**, then give the preview link and what to check. **Never push to `master` until the user says "go live".**
- **"Go live" means:** check the latest `staging` preview built, merge `staging` into `master` (fast-forward where possible), push `master`, confirm the production deploy finished, **and publish the npm package (`@lukeanill/ui`)**.
- **Always ask the user for the version number first**, before publishing: say what changed since the last release, whether it breaks anything, and recommend a version (semver). Publish only after they answer.

## Before saying done

- Test in the browser and report what you did and did not check.
- End by asking the user to QA, with URLs and what to check.
