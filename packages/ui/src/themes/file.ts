// The file someone downloads: a header that tells an AI how to use the theme,
// the font import, and the theme itself as CSS from themeToCss().

import { themeFamilies, themeToCss } from "./css"
import { fontChoice, googleFontsHref } from "./fonts"
import { VALUE_QUESTIONS, answerOf } from "./values"
import type { Theme } from "./types"

const PACKAGE = "@lukeanill/ui"

export const slugify = (label: string) =>
  label
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "my-theme"

const fontLine = (role: string, f: Theme["fonts"]["display"]) =>
  ` *   ${role.padEnd(8)} ${f.family}, weight ${f.weight}${fontChoice(f.family)?.source === "bundled" ? " (bundled with the package)" : ""}`

/** The header comment: how to use the theme, and the UX direction it was made with. */
export function themeHeader(theme: Theme, { unset = [] as string[] } = {}) {
  const lines = [
    `/*`,
    ` * ${theme.label} — a theme for ${PACKAGE}`,
    ` * Made with the Themer. Safe to edit by hand.`,
    ` *`,
    ` * FOR THE AI BUILDING WITH THIS THEME`,
    ` * 1. Import this file once, after the design system's styles:`,
    ` *      import "${PACKAGE}/globals.css"`,
    ` *      import "./${theme.id}.css"`,
    ` *    Keep the @import line below first in whatever stylesheet it ends up in, or`,
    ` *    the font will not load. A <link> tag for the same URL works too.`,
    ` * 2. Apply it:`,
    ` *      import { ThemeProvider } from "${PACKAGE}/components/theme-provider"`,
    ` *      <ThemeProvider forcedTheme="${theme.id}">…</ThemeProvider>`,
    ` * 3. Style with the semantic tokens below, never hard-coded colours, fonts or radii:`,
    ` *      bg-background  text-foreground  bg-card  bg-primary  text-primary-foreground`,
    ` *      bg-secondary  text-muted-foreground  border-border  rounded-(--radius)`,
    ` *      font-heading (headings)  font-sans (body)  font-serif (emphasis)`,
    ` * 4. Build with the components from ${PACKAGE}. They read these tokens.`,
    ` * 5. Let the UX direction below decide layout, flow and wording.`,
    ` *`,
    ` * UX DIRECTION`,
    ...VALUE_QUESTIONS.map((q, i) => {
      const a = answerOf(i, theme.values[i])
      return ` *   ${q.question}\n *     ${a.label}. ${a.description}`
    }),
    ` *`,
    ` * FONTS`,
    fontLine("Heading", theme.fonts.display),
    fontLine("Body", theme.fonts.body),
    fontLine("Serif", theme.fonts.serif),
    ` * ICONS`,
    ` *   ${theme.icons.style === "phosphor" ? "Phosphor" : "Lucide"}, ${theme.icons.weight} weight`,
    ` *`,
    ` * SETTINGS`,
    ` *   spacing ${theme.spacing}, radius ${theme.radius}, elevation ${theme.elevation}, material ${theme.material}, motion ${theme.motion}`,
    ` *   Components do not read spacing, motion or the gradient material yet. They are`,
    ` *   carried as --theme-spacing, --theme-motion and --theme-material.`,
  ]
  if (unset.length) {
    lines.push(` *`, ` * NOT CHOSEN IN THE THEMER`, ` *   ${unset.join(", ")} were left empty and use Berghain's values.`)
  }
  lines.push(` */`)
  return lines.join("\n")
}

/** The whole downloadable file. */
export function themeToFile(theme: Theme, options?: { unset?: string[] }) {
  const href = googleFontsHref(themeFamilies(theme))
  return [
    themeHeader(theme, options),
    "",
    ...(href ? [`@import url("${href}");`, ""] : []),
    themeToCss(theme),
  ].join("\n")
}
