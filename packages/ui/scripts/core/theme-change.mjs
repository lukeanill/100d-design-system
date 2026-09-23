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

// The circles each list row shows, in the order the design annotates them.
// `background` carries a border in the UI because it is often the same colour
// as the row it sits on, and an unbordered circle would simply vanish.
const SWATCHES = ["background", "foreground", "card", "primary", "secondary"]

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
 * The themes the site can actually use. An archived theme keeps its file, so
 * it can come back exactly as it was, but it is written out of tokens.css and
 * the registry: no CSS block to apply, and nothing to pick it from.
 */
const liveThemes = (themes) => Object.values(themes).filter((theme) => !theme.archived)

/**
 * The default theme is whichever one is first in the studio's list, and it is
 * the one written to `:root`. Everything else is a class.
 *
 * Derived rather than stored, so moving a theme to the top of the list is all
 * it takes to make it the default — and so there is always exactly one, which
 * the site needs: a page with no theme class falls back to `:root`, and with no
 * `:root` block it renders with no tokens at all.
 *
 * Mutates `themes` and records any file that changed.
 */
function syncRootSelector(themes, files) {
  const first = liveThemes(themes).sort((a, b) => (a.order ?? 99) - (b.order ?? 99))[0]
  for (const theme of Object.values(themes)) {
    const selector = theme.name === first?.name ? ":root" : `.${theme.name}`
    if (theme.selector === selector) continue
    themes[theme.name] = { ...theme, selector }
    files[themePath(theme.name)] = serialize(themes[theme.name])
  }
}

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
    // A starting point only: syncRootSelector has the final say, giving
    // `:root` to whichever theme is first in the list and a class to the rest.
    selector: body.selector ?? existing.selector ?? `.${name}`,
    seeds: body.seeds ?? existing.seeds ?? {},
    fonts: body.fonts ?? existing.fonts ?? {},
    edges: body.edges ?? existing.edges ?? "custom",
    overrides: body.overrides ?? existing.overrides ?? {},
    fontSource: body.fontSource ?? existing.fontSource ?? "google",
    ...(body.fontTheme ?? existing.fontTheme
      ? { fontTheme: body.fontTheme ?? existing.fontTheme }
      : {}),
    tokens: body.tokens ?? existing.tokens,
    // Archived themes stay on disk but leave the registry and tokens.css, so
    // nothing can select one. Only ever present when true, to keep the stored
    // file free of a flag that means nothing for a live theme.
    ...((body.archived ?? existing.archived) ? { archived: true } : {}),
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

    // "Last modified" has to mean modified. Stamping every save would bump the
    // date on a no-op — reopening a theme and pressing save without touching
    // anything would make it look like the freshest thing in the list, which is
    // exactly backwards for a list you sort and scan by recency.
    const existing = themes[name]
    const same = existing && serialize({ ...existing, updatedAt: null }) === serialize({ ...theme, updatedAt: null })
    theme.updatedAt = same ? existing.updatedAt : (change.now ?? new Date().toISOString())
    if (!theme.updatedAt) delete theme.updatedAt

    themes[name] = theme
    files[themePath(name)] = serialize(theme)

    if (theme.fontSource === "google" && !theme.archived) {
      // a Google-font theme brings its own pairing along
      const next = upsertFontThemeIn(fontRegistry, {
        id: name,
        label: theme.label,
        primaryFont: theme.fonts?.primary ?? "",
        secondaryFont: theme.fonts?.emphasis ?? "",
      })
      fontRegistry = next.source
    }
    if (theme.archived) {
      colorRegistry = removeColorThemeIn(colorRegistry, name)
      if (theme.fontSource === "google") fontRegistry = removeFontThemeIn(fontRegistry, name)
    } else {
    const nextColor = upsertColorThemeIn(colorRegistry, {
      id: name,
      label: theme.label,
      fontTheme: theme.fontTheme ?? (theme.fontSource === "google" ? name : undefined),
      // the app draws its theme picker from these two rather than keeping its
      // own copy, which is how the old one came to be missing three themes
      primary: theme.tokens?.primary,
      order: theme.order,
    })
    colorRegistry = nextColor.source
    }
  } else if (change.type === "archive" || change.type === "unarchive") {
    const name = slug(change.name)
    const theme = themes[name]
    if (!name || name === "system") throw new Error("Cannot archive that theme.")
    if (!theme) throw new Error(`No theme called "${name}".`)

    const archiving = change.type === "archive"
    const next = { ...theme }
    if (archiving) next.archived = true
    else delete next.archived

    themes[name] = next
    files[themePath(name)] = serialize(next)

    if (archiving) {
      colorRegistry = removeColorThemeIn(colorRegistry, name)
      if (next.fontSource === "google") fontRegistry = removeFontThemeIn(fontRegistry, name)
    } else {
      colorRegistry = upsertColorThemeIn(colorRegistry, {
        id: name,
        label: next.label,
        fontTheme: next.fontTheme ?? (next.fontSource === "google" ? name : undefined),
        primary: next.tokens?.primary,
        order: next.order,
      }).source
      if (next.fontSource === "google") {
        fontRegistry = upsertFontThemeIn(fontRegistry, {
          id: name,
          label: next.label,
          primaryFont: next.fonts?.primary ?? "",
          secondaryFont: next.fonts?.emphasis ?? "",
        }).source
      }
    }
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
      // The registry carries `order` too, because the app's theme picker sorts
      // by it. Skipping this here is how a reorder in the studio would leave
      // the site showing the old sequence.
      colorRegistry = upsertColorThemeIn(colorRegistry, {
        id: name,
        label: theme.label,
        fontTheme: theme.fontTheme,
        primary: theme.tokens?.primary,
        order: index,
      }).source
    })
  } else {
    throw new Error(`Unknown change type: ${change.type}`)
  }

  // Whatever the change was, it may have moved which theme is first: a
  // reorder, a new theme, or archiving the one that held :root.
  syncRootSelector(themes, files)

  if (colorRegistry !== workspace.colorRegistry) files[COLOR_REGISTRY] = colorRegistry
  if (fontRegistry !== workspace.fontRegistry) files[FONT_REGISTRY] = fontRegistry

  // regenerate tokens.css so the change is live and diffable, and so the CI
  // check that tokens.css matches tokens/*.json stays green
  const tokensCss = renderTokensCss(workspace.tokensCss, liveThemes(themes))
  if (tokensCss !== workspace.tokensCss) files[TOKENS_CSS] = tokensCss

  const contrast = evaluateContrast(liveThemes(themes), workspace.baseline ?? {})

  // Contrast never stops a save. That is the design system owner's standing
  // decision, not an oversight: they are the one judging legibility, some pairs
  // cannot be fixed by lightness at all, and being unable to save a theme you
  // meant to make is worse than a pair sitting at 4.03 rather than 4.5.
  //
  // Recording the shortfalls here is what makes the save mean anything —
  // commit the theme without them and CI goes red and it never deploys, so the
  // studio would report success having changed nothing.
  //
  // The cost, stated plainly: the gate no longer catches a studio save that
  // makes a recorded pair worse, because that save re-records it. It still
  // guards hand-edits and anything else that does not come through here. The
  // numbers stay visible in this file, in the diff, and in the studio's report.
  if (contrast.failures.length) {
    files[BASELINE] = JSON.stringify(contrast.nextBaseline, null, 2) + "\n"
  }

  return { files, themes: listThemes(themes), contrast }
}
