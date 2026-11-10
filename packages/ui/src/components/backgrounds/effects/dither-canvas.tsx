"use client"

import * as React from "react"

import { EffectBackground, type EffectBackgroundProps } from "@workspace/ui/components/backgrounds/effect-background"

/*
 * Dither Canvas: an animated noise field quantised with an ordered Bayer-matrix dither to the palette,
 * drawn on a low-resolution canvas and scaled up with crisp pixels.
 *
 * Written fresh in the spirit of the Hyperiux Vault "Dither Canvas" effect
 * (https://vault.hyperiux.com/effects/backgrounds/dither-canvas). The page shows its code behind a
 * "Get Code" control, so none of it was copied; no Hyperiux code or assets are included here.
 */

/** The effect's own palette (used when `useThemeColors` is off): near-black to near-white. */
const DEFAULT_COLORS = ["#0a0a0a", "#2b2b2b", "#7a7a7a", "#e8e8e8"]

// 8x8 Bayer matrix, values 0..63.
const BAYER_8 = (() => {
  const m = [[0, 2], [3, 1]]
  let size = 2
  let cur = m
  while (size < 8) {
    const next: number[][] = Array.from({ length: size * 2 }, () => new Array<number>(size * 2).fill(0))
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const v = cur[y]![x]! * 4
        next[y]![x] = v
        next[y]![x + size] = v + 2
        next[y + size]![x] = v + 3
        next[y + size]![x + size] = v + 1
      }
    }
    cur = next
    size *= 2
  }
  return Float32Array.from(cur.flat(), (v) => (v + 0.5) / 64)
})()

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.trim().replace(/^#/, "")
  if (h.length === 3 || h.length === 4) h = h.split("").map((c) => c + c).join("")
  const n = parseInt(h.slice(0, 6), 16)
  if (Number.isNaN(n)) return [0, 0, 0]
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

interface DitherCanvasProps {
  /** Size of one dither pixel in CSS px. */
  pixelSize?: number
  /** Animation speed multiplier. */
  speed?: number
  /** Shifts the field brighter (positive) or darker (negative), -0.5 to 0.5. */
  threshold?: number
  /** Scale of the noise features: larger is broader. */
  scale?: number
  /** How strongly the pointer pushes the field (0 turns it off). */
  pointerStrength?: number
}

function TheEffect({
  colors,
  running,
  pixelSize = 3,
  speed = 1,
  threshold = 0,
  scale = 1,
  pointerStrength = 1,
}: { colors: string[]; running: boolean } & DitherCanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const paletteKey = colors.join("|")

  React.useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    const ctx = canvas?.getContext("2d")
    if (!canvas || !host || !ctx) return

    const palette = paletteKey.split("|").map(hexToRgb)
    const stops = palette.length
    const cell = Math.max(1, pixelSize)
    let w = 1
    let h = 1
    let image = ctx.createImageData(1, 1)
    let raf = 0
    let time = 0
    let last = 0
    let rect = host.getBoundingClientRect()
    // Pointer in canvas pixels, eased towards its target; strength decays when it leaves.
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, power: 0, tpower: 0 }

    const resize = () => {
      rect = host.getBoundingClientRect()
      w = Math.max(1, Math.ceil(rect.width / cell))
      h = Math.max(1, Math.ceil(rect.height / cell))
      canvas.width = w
      canvas.height = h
      image = ctx.createImageData(w, h)
    }

    const draw = () => {
      const data = image.data
      const t = time * 0.25 * speed
      const zoom = 0.045 / Math.max(0.05, scale) // field frequency in dither pixels
      const aspect = w / h
      for (let y = 0; y < h; y++) {
        const ny = y * zoom
        for (let x = 0; x < w; x++) {
          const nx = x * zoom
          let v =
            Math.sin(nx * 1.7 + t * 1.1) +
            Math.sin(ny * 2.1 - t * 0.9 + Math.sin(nx * 0.8 + t * 0.4) * 1.5) +
            Math.sin((nx + ny) * 1.2 + t * 0.7) +
            Math.sin(Math.hypot(nx - 3, ny - 2) * 2.2 - t * 1.3)
          v = v / 8 + 0.5
          if (pointer.power > 0.001) {
            const dx = (x - pointer.x) * Math.min(1, aspect)
            const dy = (y - pointer.y) * Math.min(1, 1 / aspect)
            const d = Math.hypot(dx, dy) / (Math.min(w, h) * 0.22)
            v += pointer.power * 0.45 * Math.exp(-d * d)
          }
          v = Math.min(1, Math.max(0, v + threshold))
          // Position along the palette, dithered between the two neighbouring stops.
          const p = v * (stops - 1)
          let i = Math.floor(p)
          if (i >= stops - 1) i = stops - 2
          const frac = p - i
          const pick = frac > BAYER_8[(y & 7) * 8 + (x & 7)]! ? i + 1 : i
          const c = palette[pick]!
          const o = (y * w + x) * 4
          data[o] = c[0]
          data[o + 1] = c[1]
          data[o + 2] = c[2]
          data[o + 3] = 255
        }
      }
      ctx.putImageData(image, 0, 0)
    }

    const frame = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0
      last = now
      time += dt
      const ease = 1 - Math.pow(0.001, dt)
      pointer.x += (pointer.tx - pointer.x) * ease
      pointer.y += (pointer.ty - pointer.y) * ease
      pointer.power += (pointer.tpower - pointer.power) * ease
      draw()
      raf = requestAnimationFrame(frame)
    }

    const onMove = (event: PointerEvent) => {
      if (pointerStrength <= 0) return
      const inside =
        event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom
      pointer.tpower = inside ? pointerStrength : 0
      if (!inside) return
      pointer.tx = (event.clientX - rect.left) / cell
      pointer.ty = (event.clientY - rect.top) / cell
      if (pointer.power < 0.001) {
        pointer.x = pointer.tx
        pointer.y = pointer.ty
      }
    }
    const onLeave = () => {
      pointer.tpower = 0
    }

    resize()
    draw()
    const observer = new ResizeObserver(() => {
      resize()
      draw()
    })
    observer.observe(host)
    if (running) {
      last = 0
      raf = requestAnimationFrame(frame)
      window.addEventListener("pointermove", onMove)
      document.documentElement.addEventListener("pointerleave", onLeave)
    }

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener("pointermove", onMove)
      document.documentElement.removeEventListener("pointerleave", onLeave)
    }
  }, [paletteKey, running, pixelSize, speed, threshold, scale, pointerStrength])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 size-full"
      style={{ imageRendering: "pixelated" }}
    />
  )
}

export function DitherCanvasBackground({ paused, useThemeColors, inverse, scrim, scrimColor, className, ...effect }: EffectBackgroundProps & DitherCanvasProps) {
  return (
    <EffectBackground
      colors={DEFAULT_COLORS}
      paused={paused}
      useThemeColors={useThemeColors}
      inverse={inverse}
      scrim={scrim}
      scrimColor={scrimColor}
      className={className}
    >
      {({ colors, running }) => <TheEffect colors={colors} running={running} {...effect} />}
    </EffectBackground>
  )
}

export type { EffectBackgroundProps }
