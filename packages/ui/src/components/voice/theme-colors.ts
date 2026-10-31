"use client"

import { useEffect, useRef, type RefObject } from "react"

import { observeTheme } from "@workspace/ui/lib/observe-theme"

/**
 * The four theme colours the voice components can wear: primary, primary foreground, secondary and secondary
 * foreground, read where the component sits (so a scoped theme is followed) as [r, g, b] from 0 to 255.
 */
const TOKENS = ["--primary", "--primary-foreground", "--secondary", "--secondary-foreground"] as const

let probe: CanvasRenderingContext2D | null = null

/** Any CSS colour (the themes write oklch) as [r, g, b]; the canvas does the conversion. */
function toRgb(color: string): [number, number, number] | null {
  if (typeof document === "undefined" || !color) return null
  probe ??= Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext("2d", { willReadFrequently: true })
  if (!probe) return null
  probe.clearRect(0, 0, 1, 1)
  probe.fillStyle = "#000"
  probe.fillStyle = color
  probe.fillRect(0, 0, 1, 1)
  const [r, g, b, a] = probe.getImageData(0, 0, 1, 1).data
  return a === 0 ? null : [r!, g!, b!]
}

function readThemeColors(el: Element | null): [number, number, number][] | undefined {
  if (!el) return undefined
  const css = getComputedStyle(el)
  const colors = TOKENS.map((token) => toRgb(css.getPropertyValue(token).trim()))
  return colors.every(Boolean) ? (colors as [number, number, number][]) : undefined
}

const hex = ([r, g, b]: [number, number, number]) => `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`

/** The theme colours at `ref`, kept current as the theme changes, in a ref for a frame loop to read. */
function useThemeColorsRef(ref: RefObject<Element | null>, enabled: boolean) {
  const colors = useRef<[number, number, number][] | undefined>(undefined)
  useEffect(() => {
    if (!enabled) return
    const read = () => {
      colors.current = readThemeColors(ref.current)
    }
    read()
    return observeTheme(ref.current, read)
  }, [ref, enabled])
  return colors
}

export { hex, readThemeColors, useThemeColorsRef }
