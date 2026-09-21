// The one place a theme change turns into file contents.
//
// Both the dev server's studio API and the hosted studio's serverless API call
// this, so "save" means exactly the same thing whether you are on localhost or
// on the deployed site. Nothing here touches the filesystem or the network:
// callers pass in a snapshot of the current files and get back the files that
// should replace them.

import { renderTokensCss } from "./tokens-core.mjs"
import {
  removeColorThemeIn,
  removeFontThemeIn,
  upsertColorThemeIn,
  upsertFontThemeIn,
} from "./registry-core.mjs"
import { evaluateContrast } from "./contrast-core.mjs"

export const TOKENS_DIR = "packages/ui/tokens"
export const TOKENS_CSS = "packages/ui/src/styles/tokens.css"
export const COLOR_REGISTRY = "packages/ui/src/lib/theme-registry.ts"
export const FONT_REGISTRY = "packages/ui/src/lib/font-theme-registry.ts"
export const BASELINE = "packages/ui/tokens/.contrast-baseline.json"

export const themePath = (name) => `${TOKENS_DIR}/${name}.json`

export const slug = (name) =>
  String(name ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

// the six circles each list row shows, resolved for convenience
const SWATCHES = ["background", "foreground", "primary", "secondary", "muted", "accent"]

/** Studio display order, with the swatches each row needs. */
export function listThemes(themes) {
  return Object.values(themes)
    .map((theme) => ({
      ...theme,
      swatches: SWATCHES.map((token) => theme.tokens?.[token]).filter(Boolean),
    }))
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
}

const serialize = (theme) => JSON.stringify(theme, null, 2) + "\n"

/**
 * Emit keys in the order the stored file already used, so re-saving an
 * untouched theme is a no-op diff rather than a whole-file reshuffle. The
 * studio's commits are meant to be readable; a reordered file hides the one
 * line that actually changed.
 */
function orderLike(next, existing) {
  if (!existing) return next
  const out = {}
  for (const key of Object.keys(existing)) if (key in next) out[key] = next[key]
  for (const key of Object.keys(next)) if (!(key in out)) out[key] = next[key]
  return out
}

/** Merge a submitted theme over whatever is already stored under that name. */
function normalize(body, existing = {}, themeCount = 0) {
  const name = slug(body.name)
  return {
    name,
    label: body.label ?? existing.label ?? body.name ?? name,
    order: body.order ?? existing.order ?? themeCount,
    // Never re-derive a stored selector. The light theme is the `:root`
    // default, and deriving would rewrite it to `.light` — which drops the
    // default theme off the root and leaves the site unstyled until a class
    // is set. Only genuinely new themes get a selector computed for them.
    selector: body.selector ?? existing.selector ?? (name === "system" ? ":root" : `.${name}`),
    seeds: body.seeds ?? existing.seeds ?? {},
    fonts: body.fonts ?? existing.fonts ?? {},
    edges: body.edges ?? existing.edges ?? "custom",
    overrides: body.overrides ?? existing.overrides ?? {},
    fontSource: body.fontSource ?? existing.fontSource ?? "google",
    ...(body.fontTheme ?? existing.fontTheme
      ? { fontTheme: body.fontTheme ?? existing.fontTheme }
      : {}),
    tokens: body.tokens ?? existing.tokens,
    ...(body.extra ?? existing.extra ? { extra: body.extra ?? existing.extra } : {}),
  }
}

/**
 * @param workspace {{ themes, tokensCss, colorRegistry, fontRegistry, baseline }}
 *   `themes` is a map of name → theme object.
 * @param change {{ type: "save" | "delete" | "reorder", ... }}
 * @returns {{ files, themes, contrast }} — `files` maps repo-relative paths to
 *   their new contents, or null to delete. Only changed paths are included.
 */
export function applyThemeChange(workspace, change) {
  const themes = { ...workspace.themes }
  const files = {}
  let colorRegistry = workspace.colorRegistry
  let fontRegistry = workspace.fontRegistry

  if (change.type === "save") {
    const name = slug(change.theme?.name)
    if (!name) throw new Error("A theme needs a name.")

    const theme = orderLike(
      normalize(change.theme, themes[name], Object.keys(themes).length),
      themes[name]
    )
    if (!theme.tokens || !Object.keys(theme.tokens).length) {
      throw new Error("A theme needs a generated palette before it can be saved.")
    }

    themes[name] = theme
    files[themePath(name)] = serialize(theme)

    if (theme.fontSource === "google") {
      // a Google-font theme brings its own pairing along
      const next = upsertFontThemeIn(fontRegistry, {
        id: name,
        label: theme.label,
        primaryFont: theme.fonts?.primary ?? "",
        secondaryFont: theme.fonts?.emphasis ?? "",
      })
      fontRegistry = next.source
    }
    const nextColor = upsertColorThemeIn(colorRegistry, {
      id: name,
      label: theme.label,
      fontTheme: theme.fontTheme ?? (theme.fontSource === "google" ? name : undefined),
    })
    colorRegistry = nextColor.source
  } else if (change.type === "delete") {
    const name = slug(change.name)
    if (!name || name === "system") throw new Error("Cannot delete that theme.")
    const removing = themes[name]
    if (!removing) throw new Error(`No theme called "${name}".`)

    delete themes[name]
    files[themePath(name)] = null
    colorRegistry = removeColorThemeIn(colorRegistry, name)
    if (removing.fontSource === "google") fontRegistry = removeFontThemeIn(fontRegistry, name)
  } else if (change.type === "reorder") {
    const order = Array.isArray(change.order) ? change.order : []
    if (!order.length) throw new Error("Send an ordered list of theme names.")
    order.forEach((themeName, index) => {
      const name = slug(themeName)
      const theme = themes[name]
      if (!theme || theme.order === index) return
      themes[name] = { ...theme, order: index }
      files[themePath(name)] = serialize(themes[name])
    })
    // order is metadata only — no CSS or registry regeneration needed
    return { files, themes: listThemes(themes), contrast: null }
  } else {
    throw new Error(`Unknown change type: ${change.type}`)
  }

  if (colorRegistry !== workspace.colorRegistry) files[COLOR_REGISTRY] = colorRegistry
  if (fontRegistry !== workspace.fontRegistry) files[FONT_REGISTRY] = fontRegistry

  // regenerate tokens.css so the change is live and diffable, and so the CI
  // check that tokens.css matches tokens/*.json stays green
  const tokensCss = renderTokensCss(workspace.tokensCss, Object.values(themes))
  if (tokensCss !== workspace.tokensCss) files[TOKENS_CSS] = tokensCss

  const contrast = evaluateContrast(Object.values(themes), workspace.baseline ?? {})

  // `acceptContrast` is set only when the designer has been shown the failing
  // pairs and chosen to keep them. Recording them in the baseline is part of
  // that same decision: without it the commit lands, CI goes red, and the theme
  // never reaches the site — the save would look successful and do nothing.
  //
  // This is deliberately not automatic. The gate exists to make a drop in
  // legibility something a person decides rather than something nobody notices,
  // and it still fails on its own if a recorded pair later gets worse.
  if (change.acceptContrast && contrast.failures.length) {
    files[BASELINE] = JSON.stringify(contrast.nextBaseline, null, 2) + "\n"
  }

  return { files, themes: listThemes(themes), contrast }
}
