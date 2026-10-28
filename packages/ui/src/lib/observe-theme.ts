/**
 * Calls `callback` whenever the class or inline style of `el` or any ancestor changes, which is how a
 * theme is put on (or taken off) an element: a theme is a class, and a scoped theme adds custom
 * properties in `style`. Returns the function that stops watching.
 */
export function observeTheme(el: Element | null, callback: () => void) {
  if (typeof MutationObserver === "undefined") return () => {}
  const observer = new MutationObserver(callback)
  for (let node: Element | null = el ?? document.documentElement; node; node = node.parentElement) {
    observer.observe(node, { attributes: true, attributeFilter: ["class", "style"] })
  }
  return () => observer.disconnect()
}
