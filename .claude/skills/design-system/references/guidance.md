# Guidance

Direction for the design system and for themes. Sources: `CLAUDE.md`, `docs/component-theming-guidelines.md` (a working draft: rule numbers below are its numbers), `docs/themer.md`, and the standing rules Luke has given. When a rule here and the source disagree, the source wins: re-read it.

## 1. How to work in this repo

1. **Use `@workspace/ui` first.** Before writing UI, look in `packages/ui` for the component, token, glass layer, utility or theme setting that does the job. Adapt only when it cannot express the design, and say why.
2. **Copy what already exists.** Find the closest built thing (the Themer in `apps/web/src/themer`, the homepage tiles in `apps/web/src/LinkTile.tsx`, `Showcase.tsx`, the Storybook stories) and match its structure, glass, header, spacing, motion and states. Do not invent a second version.
3. **Never fake what the system provides.** No hand-drawn gradients, blurs, shadows, radii or colours standing in for a token, a glass weight (`GlassLayer`, `LiquidGlass`) or a component. Literal px only where the Figma specifies one and no token matches.
4. **Say which you used.** Every report lists what was reused from the design system or existing work, and what was built new and why.
5. **Figma is read-only unless the user explicitly says to write** (full steps in `figma.md`). Read it in dev mode (its CSS and the `data-annotations`) and measure the build against the numbers (size, radius, padding, font weight). You change code to match Figma. You write to Figma only what the user explicitly says, after stating exactly what will change and getting a clear yes; add rather than overwrite or delete unless told to; report and check afterwards.
6. **Do not reorder themes. Do not narrow the scope that was asked for.** Apply a change to everything asked, never silently to less.
7. **Before saying done:** test in the browser, report what you did and did not check, and end by asking the user to QA with URLs and what to check. Do not ask "push to live?".
8. **If a request is ambiguous, ask first and change nothing.**
9. **Talk Figma and code, never Tailwind.** Describe every token as the Figma variable (collection, name, mode) and the code token (`--name`). Do not expose Tailwind class names, utilities or config to the user.
10. **Check what a component uses in Storybook.** Every story has a **Tokens** panel (next to Controls). It lists each design token the component uses, with the Figma variable and mode, the code token, the live value, and what it styles. Tokens with no Figma variable say so. **Add args carefully so every state can be viewed in the story:** each state a user can reach (variants, sizes, open/closed, disabled, loading, error, empty, selected), worked out from the component's real behaviour, has an arg or control that shows it. The map from code token to Figma variable is `figmaVariableFor` in `packages/ui/src/themes/figma-map.ts`.
11. **Agreed exceptions live in one file.** Where a component deliberately does not use the token Figma maps to, the exception is recorded component by component in `packages/ui/src/themes/token-exceptions.ts` (keyed by the story title), with what differs, why, and the date it was agreed. The Tokens panel shows them under the component. Add one only after the design owner agrees to it; never add one to make a check pass.

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
- 4.1.3 The outer corner of a card that contains another card = the inner card's corner + the outer padding (border not counted), capped at `radius-outer-max` (4.1.4\*). The inner card uses `radius-sm` and the outer card uses `radius-md`. A card is never fully rounded unless Figma draws it so (4.1.5\*). Fully rounded is `dimensions-max` (4.1.6).
- 4.1.7 A card uses `radius-md`. It does not step up to a larger radius.
- 4.1.8 Surfaces that float over the page (a fixed header, a fixed footer, a drawer) use `radius-lg`. They are not cards, so the cap in 4.1.3 does not apply to them. A tag uses `radius-sm`. Controls keep `radius-button` (4.1.1).

**Spacing (5.x)**
- 5.1.1 A core interactive component's padding is at least the Figma `min-padding/component` token and always an even number. 5.1.2 An input inside a component has double that padding at the sides. 5.1.3 Card padding is `size-controls/card/padding/padding-md`.
- 5.1.4 The theme `spacing` setting drives layout between components only; component padding stays fixed, so a control is the same size in every theme.

**States (7.x)** The default hover halves the opacity of the element's background. An element with no background fades as a whole. On an element with a background, a hover never changes text, icon, border or shadow colour. Prompt Bar, Streaming Text, Fluid Tabs, Morphing Discovery Bar, Control Button, Metal Surface, Native Select and Questionnaire keep the alpha wash instead: light mode adds `alpha-dark-sm` over the background and dark mode adds `alpha-light-sm` (`--control-hover`). Focus and press change only the background layer.

**Motion (8.x)** Use only the `Timing` set (`instant fast faster long longer longest`); a hover or press is `fast`. The theme's `motion` supplies the easing; `motion=none` is `instant`. In code: CSS `duration-(--motion-fast) ease-(--motion-transition-ease)`, or `useThemeTransition()` / `useThemeSpring()` for the `motion` library. A component whose animation is its identity (metal) keeps its own timing. We follow Material Design's motion principles (purposeful, quick, responsive) but never override the design system with them: the timing set, the theme's easing and the motion tokens always win. The nav-bar pill that moves between destinations uses `Timing/faster`, following Material Design for a navigation indicator. Its easing comes from the theme, as for every other transition.

**Shadow (9.x)** `shadow-*` tokens only, at the theme's strength. A popup sits one level above the component that opens it (xs → sm). We follow Material Design's elevation principles (higher means closer to the user) but never override the design system with them: the shadow tokens at the theme's strength always win. Shadow follows the element's role, one step higher for each layer above the page: tag and button `shadow-xs`, card `shadow-sm`, fixed header and footer `shadow-md`, drawer `shadow-lg`.

**Sizing (10.x)** Core interactive components are Button, Icon, Copy, Share Button, Toggle, Toggle Group and Quick Reply (actions); Input, Amount Input, Textarea and Input Otp (inputs); Native Select, Combobox, Checkbox, Radio, Switch and Slider (selects); Discrete Tabs, Fluid Tabs, Pagination and Menubar (navigation). They have a minimum height and width from the `size-controls/interactive-component` tokens; height is a minimum and grows with content. Inside another component the `component-within-component` minimums apply. Figma size tokens are mirrored in `docs/figma-size-tokens.json`.

**Popups (11.x)** Padding at least `spacing/padding/sm`, even. Corner is the card corner (`radius-md`), never the pill. Fill is the component's fill plus `alpha-dark-sm`; on glass there is no wash and a popup uses Heavy glass. There is no token for a popup's minimum width. Don't invent one or use a hand-written value. Backdrop blur is `--popup-blur` (40px under 1200px wide, 120px above). Opens at `Timing/faster`, closes at `Timing/fast`. A native select's dropdown is the browser's and keeps only the themed chip.

**Metal (12.x)** On a light mode the ring sits on a darker line (`alpha-dark-xs`); the fill under the effect is translucent, never solid white; the effect shows and animates on every metal control, and metal controls shown together are the same height.

**Issues (13.1.1)** Always say so when applying a theme token to a component hits an issue or an expected issue (a theme with no value for something the component needs).

## 3. Direction for themes

- Nine themes exist, in this fixed order (see `themes.md`). **Berghain** is the default. The homepage and the Themer always wear Berghain; a theme picked on the homepage applies to its preview only.
- One theming system. The presets are the typed definitions in `packages/ui/src/themes/presets.ts`; nothing is stored, nothing is committed by a tool, nothing runs on a server. To change a preset, edit that file; `themeToCss()` is the only generator, used by the app and by the Themer download.
- A theme is: palette (7 colours + 5 charts), three font roles, six settings (scale, spacing, radius, shadow, material, motion), icons, feel, and the four UX-direction answers. Foreground can be left empty and is worked out from the background.
- Card surface follows `color-mode`: solid = background 20% toward white/black; gradient = 10%→20%; glass = card equals background with a tinted blur.
- Component Animations: Ease = ease-out, 0.8s; Emphatic = ease-in-out, 0.4s; Springy = spring, bounce 0.7; None = instant. Page-transition speeds: Fast 0.4s, Medium 0.8s, Slow 1.2s.
- **UX direction (the four `values`).** Each theme answers four a/b questions. They steer your decisions when you design or build: what to show, what to automate, how much to expose, how to write. They do not change how it looks (that is the palette, fonts and settings). Read the theme's answers first (`values` in `presets.ts`, or the header of a Themer download, which spells them out), then apply them to every screen, flow and piece of copy. Every preset answers "a" to all four today.
  1. **Navigation: Guided (a) or Exploratory (b).**
     - Guided: one clear next step on each screen, steps in a fixed order with progress shown, a single primary action, defaults chosen for the person, onboarding and hints, few ways to wander off. Prefer wizards, stepped forms and "continue" over open menus.
     - Exploratory: open layouts, browsing, search and filters, shortcuts and several ways in, no forced order, people can jump anywhere and come back. Prefer hubs, galleries and rich navigation over a fixed path.
  2. **Decisions: Automated (a) or In control (b).**
     - Automated: pick sensible defaults, pre-fill, suggest the next action, do the work and show the result with an easy undo. Ask only when the answer cannot be guessed. Fewer confirmations.
     - In control: show the options and let the person choose, confirm before anything that changes data, expose settings and manual overrides, make every automatic action visible and reversible, never act silently.
  3. **Density: Simple (a) or Powerful (b).**
     - Simple: show only what is needed now, hide the rest behind progressive disclosure, few controls per screen, short forms, one task at a time, plenty of whitespace.
     - Powerful: expose the full set of options and information within reach, denser layouts, advanced settings, bulk actions, keyboard shortcuts, tables and detail views.
  4. **Voice: Casual (a) or Professional (b).**
     - Casual: friendly, plain words, contractions, short sentences, warm empty states and error messages, the odd bit of personality.
     - Professional: direct and to the point, neutral, precise terms, no jokes or filler, errors state what happened and what to do next.
  5. **How to apply them.**
     - They decide structure, defaults, flow and copy, so apply them when you choose a layout, the number of steps, what is pre-filled, what needs confirming, and every label, message and empty state.
     - They never override the design system: no new colours, fonts, spacing or components because of a value. Use existing components and tokens to express them (for example, Exploratory still uses the same Navigation components, arranged differently).
     - Where two values pull against each other (Automated with Powerful, for example), follow each in its own area: automate the routine, expose the options behind it.
     - When a request conflicts with a value, or the answers are missing, say which value applies and what you chose, and ask if it matters. Do not quietly pick the opposite.
     - In reports, name which answers you applied and where.
- Fonts: bundled faces are in `packages/ui/src/styles/fonts`; the rest load from Google Fonts. Swear Display Demo (Amnesia) is a demo face: check its licence before shipping.

## 4. Open questions

None at the moment. If a rule needs a decision that is not written here, do not guess it: ask Luke.

## 5. Known gaps

- Components do not read `--theme-spacing` or the Feel tokens yet; the theme file carries them.
- `ThemePageTransition` still calls Curtain + Iris `curtain`, while the Themer's `curtain` is the StepCurtain story. Settle the names when the app starts reading `--theme-transition`.
- `packages/ui/tokens/*.json` holds six old theme files (amnesia, berghain, bootshaus, fabrik, illuzion, laroc); the TypeScript presets are the source of truth.
