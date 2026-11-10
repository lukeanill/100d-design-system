"use client"

import * as React from "react"

/* The theme's colours as a background is painted from them, shared by every background: read from the
 * theme tokens, as sRGB hex, and re-read whenever the theme changes. (Moved out of gradient-background.tsx.) */

/** Theme tokens a background is painted from, darkest role last for most themes. */
export const THEME_COLOR_TOKENS = ["--background", "--muted", "--secondary", "--accent", "--primary"]
/** Inverse: the foreground takes the base's place and the background the highlight's. */
export const INVERSE_COLOR_TOKENS = ["--foreground", "--muted", "--secondary", "--accent", "--background"]

/**
 * The theme's colours as seen from an element, as six-digit hex — Balsa only
 * takes hex, and the theme's tokens are oklch (or var() chains, which the
 * browser has already resolved by the time getComputedStyle returns them).
 * Joined into one string so useSyncExternalStore can compare snapshots.
 */
let probe: CanvasRenderingContext2D | null | undefined

export function readThemeColors(element: Element | null, inverse = false): string {
  if (!element) return ""
  probe ??= Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext("2d", {
    willReadFrequently: true,
  })
  const context = probe
  if (!context) return ""
  const style = getComputedStyle(element)
  // Painted and read back rather than read from fillStyle: Chrome keeps
  // oklch() as written there, and Balsa needs sRGB hex.
  const hex = (token: string) => {
    const value = style.getPropertyValue(token).trim()
    if (!value) return null
    context.clearRect(0, 0, 1, 1)
    context.fillStyle = "#000"
    context.fillStyle = value
    context.fillRect(0, 0, 1, 1)
    const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data
    if (a < 128) return null
    return ("#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")).toUpperCase()
  }
  const colors = [...new Set((inverse ? INVERSE_COLOR_TOKENS : THEME_COLOR_TOKENS).map(hex).filter((c): c is string => Boolean(c)))]
  // a theme whose tokens collapse to one colour still needs two stops
  const foreground = hex("--foreground")
  if (colors.length < 2 && foreground && !colors.includes(foreground)) colors.push(foreground)
  return colors.length >= 2 ? colors.join(",") : ""
}

/**
 * Re-reads the theme colours whenever something that could change them does:
 * a theme class or inline tokens on the element or any ancestor (ThemeProvider
 * sets a class on <html>; the Themer paints tokens on a wrapper), or the
 * system colour scheme.
 */
export function useThemeColors(ref: React.RefObject<HTMLElement | null>, enabled: boolean, inverse = false) {
  const subscribe = React.useCallback(
    (notify: () => void) => {
      if (!enabled) return () => {}
      const observer = new MutationObserver(notify)
      for (let node = ref.current as Element | null; node; node = node.parentElement) {
        observer.observe(node, { attributes: true, attributeFilter: ["class", "style", "data-theme"] })
      }
      const scheme =
        typeof window.matchMedia === "function" ? window.matchMedia("(prefers-color-scheme: dark)") : undefined
      scheme?.addEventListener("change", notify)
      return () => {
        observer.disconnect()
        scheme?.removeEventListener("change", notify)
      }
    },
    [ref, enabled]
  )
  const snapshot = React.useSyncExternalStore(
    subscribe,
    () => (enabled ? readThemeColors(ref.current, inverse) : ""),
    () => ""
  )
  return snapshot ? snapshot.split(",") : undefined
}

