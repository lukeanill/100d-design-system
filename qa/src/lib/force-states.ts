/**
 * Hover and keyboard focus cannot be switched on from outside, so a card could only show a
 * component at rest. This copies the page's own :hover and :focus-visible rules, as written,
 * onto two markers: an element with `data-qa-hover` or `data-qa-focus` then shows the styles
 * the component really applies in that state, held on. Nothing here is drawn by hand.
 */
let installed = false

// typed loosely so they spread onto any component
export const HOVER: Record<string, string> = { "data-qa-hover": "" }
export const FOCUS: Record<string, string> = { "data-qa-focus": "" }

const WANTED = /:hover|:focus-visible/

function copy(rule: CSSRule): string {
  if (rule instanceof CSSStyleRule) {
    if (WANTED.test(rule.selectorText)) {
      // a colon after a backslash belongs to a class name (`has-\\[...\\]\\:focus-visible`), not to a pseudo-class
      return rule.cssText.replace(/(?<!\\):hover/g, "[data-qa-hover]").replace(/(?<!\\):focus-visible/g, "[data-qa-focus]")
    }
    // Tailwind writes a variant as a rule nested in the class: `.hover\:x { &:hover { ... } }`
    const nested = [...rule.cssRules].map(copy).join("")
    return nested ? `${rule.selectorText}{${nested}}` : ""
  }
  if (rule instanceof CSSGroupingRule) {
    const inner = [...rule.cssRules].map(copy).join("")
    // an @media, @supports or @layer block keeps its own condition around what it holds
    return inner ? `${rule.cssText.slice(0, rule.cssText.indexOf("{"))}{${inner}}` : ""
  }
  return ""
}

export function installForcedStates() {
  if (installed) return
  installed = true
  const css: string[] = []
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) css.push(copy(rule))
    } catch {
      // a sheet from another origin cannot be read
    }
  }
  const style = document.createElement("style")
  style.dataset.qa = "forced-states"
  style.textContent = css.join("\n")
  document.head.append(style)
}
