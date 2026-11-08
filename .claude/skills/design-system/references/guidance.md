# Guidance

Direction for the design system and for themes. Sources: `CLAUDE.md`, `docs/component-theming-guidelines.md` (a working draft: rule numbers below are its numbers), `docs/themer.md`, and the standing rules Luke has given. When a rule here and the source disagree, the source wins: re-read it.

## 1. How to work in this repo

1. **Use `@workspace/ui` first.** Before writing UI, look in `packages/ui` for the component, token, glass layer, utility or theme setting that does the job. Adapt only when it cannot express the design, and say why.
2. **Copy what already exists.** Find the closest built thing (the Themer in `apps/web/src/themer`, the homepage tiles in `apps/web/src/LinkTile.tsx`, `Showcase.tsx`, the Storybook stories) and match its structure, glass, header, spacing, motion and states. Do not invent a second version.
3. **Never fake what the system provides.** No hand-drawn gradients, blurs, shadows, radii or colours standing in for a token, a glass weight (`GlassLayer`, `LiquidGlass`) or a component. Literal px only where the Figma specifies one and no token matches.
4. **Say which you used.** Every report lists what was reused from the design system or existing work, and what was built new and why.
5. **Figma is read-only unless the user explicitly says to write** (full steps in `figma.md`). Read it in dev mode (its CSS and the `data-annotations`) and measure the build against the numbers (size, radius, padding, font weight). You change code to match Figma. You write to Figma only what the user explicitly says, after stating exactly what will change and getting a clear yes; add rather than overwrite or delete unless told to; report and check afterwards.
6. **Do not reorder themes. Do not narrow the scope that was asked for.** Apply a change to everything asked, never silently to less.
7. **Work from this repo only.** Sibling `100d` folders and `ds-bundle/` are stale.
8. **Before saying done:** test in the browser, report what you did and did not check, and end by asking the user to QA with URLs and what to check. Do not ask "push to live?".
9. **If a request is ambiguous, ask first and change nothing.**
10. **Talk Figma and code, never Tailwind.** Describe every token as the Figma variable (collection, name, mode) and the code token (`--name`). Do not expose Tailwind class names, utilities or config to the user.
11. **Check what a component uses in Storybook.** Every story has a **Tokens** panel (next to Controls). It lists each design token the component uses, with the Figma variable and mode, the code token, the live value, and what it styles. Tokens with no Figma variable say so. The map from code token to Figma variable is `figmaVariableFor` in `packages/ui/src/themes/figma-map.ts`.
12. **Agreed exceptions live in one file.** Where a component deliberately does not use the token Figma maps to, the exception is recorded component by component in `packages/ui/src/themes/token-exceptions.ts` (keyed by the story title), with what differs, why, and the date it was agreed. The Tokens panel shows them under the component. Add one only after the design owner agrees to it; never add one to make a check pass.

## 2. Build rules for components

From `docs/component-theming-guidelines.md`. A rule names a token, never a value, so a token change in Figma changes the components with no edit here.

**Tokens (1.x)**
- 1.1.1 Theme tokens and styles only: no hex colour, pixel radius, shadow value or duration written by hand. Every size is a `dimensions` token (directly or through `radius`, `spacing`, `icons`, `size-controls`).
- 1.1.2 Each token starts from the theme's settings: `radius=sharp` means no radius anywhere, `shadow=none` no shadow, `motion=none` no transitions.
- 1.1.3\* A component may differ only where the difference is its purpose (the metal components' animated border).
- 1.2.1 Text uses only the theme text styles and typescale sizes. Default size for controls and paragraph text is `(body) md` (`text-md`, `text-action-md`).
- 1.2.2 Font, weight, line height and letter spacing come from theme variables; a component never sets its own size, weight or letter spacing.

**Texture and colour mode (2.x)**
- 2.1.1 `color-mode` (light/dark) is one setting per theme. It decides which colour tokens and which glass tone a component uses. There is no second light/dark switch.
- 2.2.1 Solid: the `card` token with an alpha overlay (dark mode `alpha-dark-sm`, light mode `alpha-light-md`).
- 2.2.2 Gradient: top-to-bottom from the `md` alpha step to the `lg` step.
- 2.2.3 Glass: the Soft glass in the dark or light tone of the colour mode, as the base layer with no fill and no alpha wash under it.

**Lines (3.x)**
- 3.1.1 Outer shell border is `radius/border-width/md`; light mode `alpha-dark-xs`, dark mode `alpha-light-xs`. Dividers and popup outlines use the same colour rule (3.2.1).
- 3.1.2\* A glass texture has no border; a metal ring keeps its own.
- 3.1.3 The border is centred on the edge and never takes space from padding.

**Corners (4.x)**
- 4.1.1 Controls and elements inside a component wear `radius-button` (square on sharp, pill on rounded).
- 4.1.2\* Cards and surfaces are not fully rounded on a rounded theme; they follow the numbered steps `xs sm md lg xl`.
- 4.1.3 The outer corner of a component that contains elements = inner corner + the outer padding (border not counted), capped at `radius-outer-max` (4.1.4\*). A card is never fully rounded unless Figma draws it so (4.1.5\*). Fully rounded is `dimensions-max` (4.1.6).

**Spacing (5.x)**
- 5.1.1 A core interactive component's padding is at least the Figma `min-padding/component` token and always an even number. 5.1.2 An input inside a component has double that padding at the sides. 5.1.3 Card padding is `size-controls/card/padding/padding-md`.
- 5.1.4 The theme `spacing` setting drives layout between components only; component padding stays fixed, so a control is the same size in every theme.

**Icons (6.x)** Phosphor, in the theme's icon weight, in the `icons/container/md` box (`ThemedIcon`). A Figma-provided icon is the exception.

**States (7.x)** One hover formula for every texture: light mode adds `alpha-dark-sm` over the background, dark mode adds `alpha-light-sm` (`--control-hover`). A hover, focus or press changes only the background layer, never text, icon, border or shadow colour.

**Motion (8.x)** Use only the `Timing` set (`instant fast faster long longer longest`); a hover or press is `fast`. The theme's `motion` supplies the easing; `motion=none` is `instant`. In code: CSS `duration-(--motion-fast) ease-(--motion-transition-ease)`, or `useThemeTransition()` / `useThemeSpring()` for the `motion` library. A component whose animation is its identity (metal) keeps its own timing.

**Shadow (9.x)** `shadow-*` tokens only, at the theme's strength. A popup sits one level above the component that opens it (xs → sm).

**Sizing (10.x)** Core interactive components (button, input, select, nav) have a minimum height and width from the `size-controls/interactive-component` tokens; height is a minimum and grows with content. Inside another component the `component-within-component` minimums apply. Figma size tokens are mirrored in `docs/figma-size-tokens.json`.

**Popups (11.x)** Padding at least `spacing/padding/sm`, even. Corner is the card corner (`radius-md`), never the pill. Fill is the component's fill plus `alpha-dark-sm`; on glass there is no wash and the glass goes up one weight (Soft → Medium → Heavy). Backdrop blur is `--popup-blur` (40px under 1200px wide, 120px above). Opens at `Timing/faster`, closes at `Timing/fast`. A native select's dropdown is the browser's and keeps only the themed chip.

**Metal (12.x)** On a light mode the ring sits on a darker line (`alpha-dark-xs`); the fill under the effect is translucent, never solid white; the effect shows and animates on every metal control, and metal controls shown together are the same height.

**Issues (13.1.1)** Always say so when applying a theme token to a component hits an issue or an expected issue (a theme with no value for something the component needs).

## 3. Direction for themes

- Nine themes exist, in this fixed order (see `themes.md`). **Berghain** is the default. The homepage and the Themer always wear Berghain; a theme picked on the homepage applies to its preview only.
- One theming system. The presets are the typed definitions in `packages/ui/src/themes/presets.ts`; nothing is stored, nothing is committed by a tool, nothing runs on a server. To change a preset, edit that file; `themeToCss()` is the only generator, used by the app and by the Themer download.
- A theme is: palette (7 colours + 5 charts), three font roles, six settings (scale, spacing, radius, shadow, material, motion), icons, feel, and the four UX-direction answers. Foreground can be left empty and is worked out from the background.
- Card surface follows `color-mode`: solid = background 20% toward white/black; gradient = 10%→20%; glass = card equals background with a tinted blur.
- Component Animations: Ease = ease-out, 0.8s; Emphatic = ease-in-out, 0.4s; Springy = spring, bounce 0.7; None = instant. Page-transition speeds: Fast 0.4s, Medium 0.8s, Slow 1.2s.
- UX direction (the four `values`) guides copy and flow, not looks: Guided vs Exploratory, Automated vs In control, Simple vs Powerful, Casual vs Professional. Every preset answers "a" to all four today.
- Fonts: bundled faces are in `packages/ui/src/styles/fonts`; the rest load from Google Fonts. Swear Display Demo (Amnesia) is a demo face: check its licence before shipping.

## 4. Open questions in the source guidance

These are `?` points in the theming guidelines with no answer yet. Do not guess them; ask Luke: 4.1.7 (which radius step caps a card), 4.1.8 (radius for other surfaces), 7.1.3 (is the hover wash a shared token for every component), 8.1.4 (timing for the nav-bar pill), 10.1.4 (what else counts as a core interactive component), 11.1.4 (token for minimum popup width), 11.2.4 (Medium vs Heavy glass in popups).

## 5. Known gaps

- Components do not read `--theme-spacing` or the Feel tokens yet; the theme file carries them.
- `ThemePageTransition` still calls Curtain + Iris `curtain`, while the Themer's `curtain` is the StepCurtain story. Settle the names when the app starts reading `--theme-transition`.
- `packages/ui/tokens/*.json` holds six old theme files (amnesia, berghain, bootshaus, fabrik, illuzion, laroc); the TypeScript presets are the source of truth.
