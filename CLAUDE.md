# Guidelines

## Always build from the design system, and copy what already exists

1. **Use `@workspace/ui` first.** Before writing any UI, look for the component, token, glass layer, utility or theme setting in `packages/ui` that does the job. Use it as it is. Adapt it only when it cannot express the design, and say why.
2. **Copy patterns and behaviour from what is already built.** Find the closest existing thing (the Themer in `apps/web/src/themer`, the homepage tiles in `apps/web/src/LinkTile.tsx`, `Showcase.tsx`, the Storybook stories) and match how it is built and how it behaves: structure, glass, header, spacing, motion, states. Do not invent a second version of something that exists.
3. **Never fake what the system provides.** No hand-drawn gradients, blurs, shadows, radii or colours that stand in for a token, a glass weight (`GlassLayer`, `LiquidGlass`) or a component. Use literal px values only where the Figma specifies one and no token matches it.
4. **Say which you used.** In each report, list what was reused from the design system or from existing work, and anything built new with the reason.

## Figma

- Read Figma in dev mode: use its CSS and read the annotations (`data-annotations`). Measure the build against the numbers (size, radius, padding, font weight) before calling it done.
- Do not reorder themes. Do not narrow the scope that was asked for.

## Before saying done

- Test in the browser and report what you did and did not check.
- End by asking the user to QA, with URLs and what to check.
