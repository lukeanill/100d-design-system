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
Coeurdes Alpes card. The downloaded `.css` file is for people using
`@lukeanill/ui`: they import it, pass its id to `ThemeProvider`, and the header
tells their AI how to build with it, including the four UX-direction answers.

## Not yet

- **Feel** (animation, transitions, special FX) is phase 2.
- Components do not read `--theme-spacing`, `--theme-motion` or the gradient
  material yet. The file carries them and says so.

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
