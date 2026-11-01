# Themes and the Themer

There is one theming system. Nothing is stored, nothing is committed by a tool,
and nothing runs on a server.

**The nine presets** live in `packages/ui/src/themes/presets.ts`, taken from the
Figma `Themes` file (one `theme` variable collection, nine modes). Berghain is
the default. To change a preset, edit that file.

**One generator.** `themeToCss()` turns a theme into CSS. The app uses it for the
presets (`ThemeProvider` puts them on the page and sets a class on `<html>`), and
the Themer uses it for the file someone downloads, so what is downloaded is what
the app renders. `themeToFile()` adds the header and the font import.

**The Themer** is `/themes`: copy a preset, build from scratch, or get a generic
template. It always wears Berghain. Themes are previewed only inside the
Coeurdes Alpes product page: the design system's own components, drawn at half
size, reading the draft's tokens. The downloaded `.css` file is for people using
`@lukeanill/ui`: they import it, pass its id to `ThemeProvider`, and the header
tells their AI how to build with it, including the four UX-direction answers.

**The Look tab** is a column of tiles beside the preview, drawn to the Figma
`Themer` frame: Theme name, Color (background, foreground, primary, secondary),
Typography (heading and body font and weight, and Scale), Texture, Radius,
Shadow, Spacing and Icons. A chosen option is ringed in liquid metal (metal-fx
v1). Foreground is its own choice; left empty it is worked out from the
background. **Scale** (Small, Medium, Large) is the Figma `typescale` mode
(sm, md, lg). A theme's scale is its `settings/typescale`, and the generator
writes that mode's exact sizes as `--typescale-xs` to `--typescale-h1`, with no
multiplier. Headings (`--h1-size` to `--h6-size`), the design system's text classes
and Tailwind's `text-xs` to `text-lg` and `text-2xl` to `text-7xl` read them;
`text-xl` takes the lg step. Spacing gained
Small. Icons are Phosphor, in four weights. There is no separate texture tone:
the card follows the theme's **color-mode** (the Figma's `settings/color-mode`,
light or dark; a built theme takes it from its background). A solid card is the
background 20% toward black (dark) or white (light), a gradient card runs 10% to
20% (`--card-image`, painted by `bg-card`), and glass is tinted dark or light.

**The Feel tab** is four tiles, each with its options and a live picture of
them, drawn to the Figma frame: **Component Animations** (None, Ease, Emphatic,
Springy: a ball along a line), **Page Transitions** (style, colour, speed,
played over a ball), **Animated background** (style, theme colors, inverse
colors, overlay) and **Hero Section** (heading, text entry, button click, link
hover). Each option plays the real design-system component of the name
(Storybook's "Animation" stories), on the draft's own colours and fonts. Every
question has to be answered, "None" being an answer; a transition asks for its
colour and speed and a background for its overlay. The nine presets take their
motion from the Figma's `Settings/motion` and answer "None" to everything else.

The motion tokens are the Figma's `motion` variable collection, in
`themes/motion.ts` and as `--ease-*`, `--spring-bounce-*` and `--duration-*` in
`tokens.css` (a test keeps the two equal). **Ease** is ease-out at 0.8s,
**Emphatic** is ease-in-out at 0.4s and **Springy** is the spring (bounce 0.7);
page-transition speeds are Fast 0.4s, Medium 0.8s and Slow 1.2s. A theme's file
carries its choice as `--motion-ease`, `--motion-duration`,
`--motion-spring-bounce` and the `--theme-transition…`, `--theme-background…`
and `--theme-hero…` tokens.

## Not yet

- Components do not read `--theme-spacing`, `--theme-motion` or the Feel tokens
  yet; the file carries them and says so. Making every animated component follow
  the chosen motion is a separate task.
- `ThemePageTransition` still calls Curtain + Iris `curtain`; the Themer's `curtain`
  is the Curtain story (StepCurtain). Settle the names when the app starts reading
  `--theme-transition`.

## Fonts

Every font a preset names is bundled in `packages/ui/src/styles/fonts`: Folio Std,
Intan, ITC Garamond Std (Ultra), PP Editorial New (now unused), GT Pressura Mono
Trial, Khaviax, Swear Display Demo (Medium), Imbue (now unused), and Migra in
Extralight and Extrabold. The rest are Google Fonts. Swear Display Demo is a demo
face: check its licence before shipping.

## Checks

```bash
pnpm typecheck
pnpm --filter web exec vitest run --project unit
pnpm --filter web exec vitest run --project storybook
```
