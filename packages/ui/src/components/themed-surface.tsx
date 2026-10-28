"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"

import { observeTheme } from "@workspace/ui/lib/observe-theme"
import { GlassLayer, type GlassTone } from "@workspace/ui/components/liquid-glass"

/**
 * The fill behind a control, from the theme's texture and colour (light or dark).
 *
 * - solid: the card colour under the `alpha` sm wash
 * - gradient: the `alpha` md wash running to the lg wash
 * - glass: the Soft glass from the Glass sheet, in the theme's light or dark
 *
 * A `popup` sits one level above the component that opens it: the same fill under the `alpha` dark sm wash,
 * or, on glass, the next glass weight up (Soft → Medium).
 *
 * Solid and gradient are one custom property (`--control-fill`, written by the theme); glass is a
 * layer, so the texture is read where the control sits and a scoped theme is followed too. Put it
 * first inside a control that is `relative isolate` with its own radius.
 */
type Surface = { material: "solid" | "gradient" | "glass"; tone: GlassTone; radius: number }

function readSurface(el: HTMLElement | null): Surface {
  const fallback: Surface = { material: "solid", tone: "dark", radius: 0 }
  if (!el) return fallback
  const css = getComputedStyle(el)
  const material = css.getPropertyValue("--theme-material").trim()
  const tone = css.getPropertyValue("--theme-tone").trim()
  const parent = el.parentElement
  const box = parent?.getBoundingClientRect()
  const corner = parent ? parseFloat(getComputedStyle(parent).borderTopLeftRadius) || 0 : 0
  return {
    material: material === "glass" || material === "gradient" ? material : "solid",
    tone: tone === "light" ? "light" : "dark",
    radius: box ? Math.min(corner, box.height / 2, box.width / 2) : corner,
  }
}

function SurfaceFill({ popup = false }: { popup?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [surface, setSurface] = useState<Surface>({ material: "solid", tone: "dark", radius: 0 })

  useLayoutEffect(() => {
    const next = readSurface(ref.current)
    if (next.material !== surface.material || next.tone !== surface.tone || Math.abs(next.radius - surface.radius) > 0.5) {
      setSurface(next)
    }
  })
  useEffect(() => {
    const parent = ref.current?.parentElement ?? null
    let later = 0
    // a control may animate its radius when the theme changes (the prompt bar does), so the radius read the
    // moment the theme changes is the old one: read again when the animation is over
    const read = () => setSurface(readSurface(ref.current))
    const readSoon = () => {
      read()
      window.clearTimeout(later)
      later = window.setTimeout(read, 400)
    }
    const stop = observeTheme(ref.current, readSoon)
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(read)
    if (resize && parent) resize.observe(parent)
    parent?.addEventListener("transitionend", read)
    return () => {
      stop()
      resize?.disconnect()
      parent?.removeEventListener("transitionend", read)
      window.clearTimeout(later)
    }
  }, [])

  return (
    <span
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-clip rounded-[inherit]"
      style={
        surface.material === "glass"
          ? undefined
          : { background: popup ? "linear-gradient(var(--alpha-dark-sm), var(--alpha-dark-sm)), var(--control-fill)" : "var(--control-fill)" }
      }
    >
      {surface.material === "glass" && <GlassLayer weight={popup ? "medium" : "soft"} tone={surface.tone} radius={surface.radius} />}
    </span>
  )
}

export { SurfaceFill }
