import { buildMaps, filterMarkup, supportsSvgBackdrop } from "@workspace/ui/lib/refraction"

/**
 * Document-wide refraction for the large glass surfaces.
 *
 * A theme opts in with `--glass-refraction: 1` (see theme-settings.mjs). This
 * finds the surfaces of the card, select, overlay and dialog groups, builds an
 * SVG filter for each one's size, and points that surface's backdrop-filter at
 * it through `--glass-backdrop`. Actions and inputs are never touched: they
 * stay on the plain blur, because a bezel a few pixels deep has nothing to
 * refract.
 *
 * The filter needs a displacement map the size of the element, which CSS cannot
 * express, so this has to be script. Everything that falls short degrades to
 * the blur the surface already has: a theme that does not opt in, a browser
 * without SVG backdrop filters, a surface that is not glass at the moment.
 */

const SELECTOR = ".glass-card, .glass-select, .glass-overlay, .glass-dialog"
const HOST_ID = "glass-refraction-filters"
/** Past this many distinct sizes the cache is dropped and rebuilt for what is on screen. */
const MAX_FILTERS = 200

type Params = {
  radius: number
  bezel: number
  thickness: number
  scale: number
  blur: number
  specular: number
}

/** `glass-card` → `card`: the group decides the weight, so the numbers are per group. */
const groupOf = (el: HTMLElement) =>
  (["card", "select", "overlay", "dialog"] as const).find((name) => el.classList.contains(`glass-${name}`))

const number = (style: CSSStyleDeclaration, name: string, fallback: number) => {
  const value = parseFloat(style.getPropertyValue(name))
  return Number.isFinite(value) ? value : fallback
}

export function startGlassRefraction() {
  if (typeof document === "undefined" || !supportsSvgBackdrop()) return () => {}

  const host = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  host.id = HOST_ID
  host.setAttribute("width", "0")
  host.setAttribute("height", "0")
  host.setAttribute("aria-hidden", "true")
  host.style.cssText = "position:absolute;width:0;height:0;pointer-events:none"
  document.body.appendChild(host)

  const filters = new Map<string, string>()
  const tracked = new Set<HTMLElement>()
  const sizes = new WeakMap<HTMLElement, string>()
  let serial = 0

  const filterFor = (w: number, h: number, p: Params) => {
    const key = [w, h, p.radius, p.bezel, p.thickness, p.scale, p.blur, p.specular].join("/")
    const cached = filters.get(key)
    if (cached) return cached
    const id = `glass-r-${serial++}`
    const maps = buildMaps(w, h, p.radius, p.thickness, p.bezel, 3, p.scale)
    host.insertAdjacentHTML(
      "beforeend",
      filterMarkup(id, w, h, maps, { blur: p.blur, specularOpacity: p.specular, specularSaturation: 4 })
    )
    filters.set(key, id)
    return id
  }

  const clear = (el: HTMLElement) => {
    if (el.style.getPropertyValue("--glass-backdrop")) el.style.removeProperty("--glass-backdrop")
    sizes.delete(el)
  }

  const apply = (el: HTMLElement) => {
    const style = getComputedStyle(el)
    const on = style.getPropertyValue("--glass-refraction").trim() === "1"
    // `none` is the switch the recipe uses for "no ::before at all"
    const glass = style.getPropertyValue("--glass-layer").trim() !== "none"
    const w = Math.round(el.offsetWidth)
    const h = Math.round(el.offsetHeight)
    if (!on || !glass || w < 2 || h < 2) return clear(el)

    if (filters.size > MAX_FILTERS) {
      filters.clear()
      host.replaceChildren()
      tracked.forEach((other) => sizes.delete(other))
    }

    const group = groupOf(el)
    if (!group) return clear(el)
    const prefix = `--glass-${group}-refraction-`
    const params: Params = {
      radius: parseFloat(style.borderTopLeftRadius) || 0,
      bezel: number(style, `${prefix}bezel`, 20),
      thickness: number(style, `${prefix}thickness`, 40),
      scale: number(style, `${prefix}scale`, 1),
      blur: number(style, `${prefix}blur`, 4),
      specular: number(style, `${prefix}specular`, 0.5),
    }
    const id = filterFor(w, h, params)
    if (sizes.get(el) === id) return
    sizes.set(el, id)
    el.style.setProperty("--glass-backdrop", `url(#${id})`)
  }

  const resizes = new ResizeObserver((entries) => {
    for (const entry of entries) apply(entry.target as HTMLElement)
  })

  const track = (el: HTMLElement) => {
    if (tracked.has(el)) return
    tracked.add(el)
    resizes.observe(el)
    apply(el)
  }

  const untrack = (el: HTMLElement) => {
    if (!tracked.delete(el)) return
    resizes.unobserve(el)
    sizes.delete(el)
  }

  const scan = (root: ParentNode) => {
    if (root instanceof HTMLElement && root.matches(SELECTOR)) track(root)
    root.querySelectorAll<HTMLElement>(SELECTOR).forEach(track)
  }

  const prune = (root: Node) => {
    if (!(root instanceof HTMLElement)) return
    if (tracked.has(root)) untrack(root)
    root.querySelectorAll<HTMLElement>(SELECTOR).forEach(untrack)
  }

  // A theme change is a class or attribute flip near the root, not a resize:
  // look again at everything already tracked.
  let pending = 0
  const reapply = () => {
    cancelAnimationFrame(pending)
    pending = requestAnimationFrame(() => tracked.forEach(apply))
  }

  const mutations = new MutationObserver((records) => {
    let themed = false
    for (const record of records) {
      if (record.type === "childList") {
        record.removedNodes.forEach(prune)
        record.addedNodes.forEach((node) => node instanceof HTMLElement && scan(node))
      } else {
        themed = true
      }
    }
    if (themed) reapply()
  })
  mutations.observe(document.body, { childList: true, subtree: true })
  // a theme is a class on the root, or scoped to a subtree by one; the style
  // attribute is left out, so this module's own writes do not call it again
  const themeAttributes = ["class", "data-theme", "data-font-theme"]
  mutations.observe(document.documentElement, { attributes: true, attributeFilter: themeAttributes })
  mutations.observe(document.body, { attributes: true, subtree: true, attributeFilter: themeAttributes })

  scan(document.body)

  return () => {
    cancelAnimationFrame(pending)
    mutations.disconnect()
    resizes.disconnect()
    tracked.forEach(clear)
    tracked.clear()
    host.remove()
  }
}
