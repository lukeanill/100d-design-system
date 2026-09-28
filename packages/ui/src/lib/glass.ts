/**
 * The glass surface recipe, in one place.
 *
 * Menus, selects and popovers carried this as a copied class string in eight
 * files; cards, buttons and inputs were always solid. Both are now the same
 * mechanism, driven by the `--glass-*` variables a theme sets (see
 * theme-settings.mjs) with defaults in tokens.css that reproduce exactly what
 * each surface rendered before.
 *
 * These are plain classes defined in tokens.css, not Tailwind utilities, for
 * two reasons: a utility built by interpolating the group name is never a
 * complete class name in the source, so Tailwind would not compile it; and
 * Tailwind's `before:` variant sets `content: ""` itself, which would override
 * the `content: none` that switches an unglassed surface off.
 */
export type GlassGroup = "card" | "action" | "input" | "select" | "overlay" | "dialog"

const CLASSES: Record<GlassGroup, string> = {
  card: "glass-surface glass-card",
  action: "glass-surface glass-action",
  input: "glass-surface glass-input",
  select: "glass-surface glass-select",
  overlay: "glass-surface glass-overlay",
  dialog: "glass-surface glass-dialog",
}

/** The blur layer and the surface colour for a group, as one class string. */
export const glass = (group: GlassGroup) => CLASSES[group]
