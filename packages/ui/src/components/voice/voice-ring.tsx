"use client"

import { useEffect, useRef } from "react"

import { cn } from "@workspace/ui/lib/utils"
import { useDocumentTheme } from "@workspace/ui/components/metal-surface"
import { useThemeColorsRef } from "./theme-colors"

/**
 * A ring of light for voice interfaces: a glassy spectrum that bends with the voice and leans toward whoever
 * is speaking. After the Voice ring on libraries.dev, which exists for SwiftUI only — this one is drawn on a
 * canvas for the web.
 *
 * - `state`: "idle" drifts slowly; "listening" and "speaking" follow `level`; "processing" spins the spectrum
 *   with its highlight running round like a loader. Changes ease, never cut.
 * - `level`: the voice, 0–1, or a getter sampled every frame (no re-render per frame).
 * - `direction`: −1 left … 1 right, the side the voice comes from; the ring leans that way while a voice is
 *   heard. Voice direction (below) produces it on iPhone; on the web, pass it yourself.
 * - `colorVariant`: "spectrum" (the default) or "theme", which colours the rings with the theme's primary, primary
 *   foreground, secondary and secondary foreground.
 * - `rings`, `lean`, `ringGap`, `halo`, `deform`: the ring's own knobs, with the libraries.dev defaults.
 */
type VoiceRingState = "idle" | "listening" | "speaking" | "processing"

type VoiceRingProps = {
  state?: VoiceRingState
  level?: number | (() => number)
  direction?: number
  size?: number
  rings?: number
  lean?: number
  ringGap?: number
  halo?: number
  deform?: number
  colorVariant?: "spectrum" | "theme"
  className?: string
}

const TAU = Math.PI * 2
const SEAM = 6 // colour stops round the spectrum

const ease = (current: number, target: number, seconds: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-dt / Math.max(seconds, 0.001)))

function VoiceRing({
  state = "listening",
  level = 0,
  direction = 0,
  size = 240,
  rings = 6,
  lean = 0.91,
  ringGap = 0.02,
  halo = 0.5,
  deform = 1.45,
  colorVariant = "spectrum",
  className,
}: VoiceRingProps) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const theme = useDocumentTheme()
  const themeColors = useThemeColorsRef(canvas, colorVariant === "theme")
  // everything the frame loop reads lives in a ref, so props changing never restarts it
  const live = useRef({ state, level, direction, rings, lean, ringGap, halo, deform, theme, size, themed: colorVariant === "theme" })
  live.current = { state, level, direction, rings, lean, ringGap, halo, deform, theme, size, themed: colorVariant === "theme" }

  useEffect(() => {
    const el = canvas.current
    const ctx = el?.getContext("2d")
    if (!el || !ctx) return
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let raf = 0
    let last = performance.now()
    let voice = 0
    let presence = 0
    let side = 0
    let spin = 0
    let spinRate = 0.12
    let clock = 0

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const p = live.current
      const dpr = window.devicePixelRatio || 1
      const px = Math.round(p.size * dpr)
      if (el.width !== px) {
        el.width = px
        el.height = px
      }

      const sample = typeof p.level === "function" ? p.level() : p.level
      const heard = p.state === "listening" || p.state === "speaking"
      const target = p.state === "processing" ? 0.3 : heard ? Math.max(0, Math.min(1, sample)) : 0.05 + 0.03 * Math.sin(clock * 0.9)
      voice = ease(voice, target, target > voice ? 0.12 : 0.45, dt)
      presence = ease(presence, heard && sample > 0.04 ? 1 : 0, 0.35, dt)
      side = ease(side, Math.max(-1, Math.min(1, p.direction)), 0.5, dt)
      spinRate = ease(spinRate, p.state === "processing" ? 2.4 : 0.12 + voice * 0.5, 0.6, dt)
      if (!still) {
        clock += dt
        spin += spinRate * dt
      }

      const s = px
      const c = s / 2
      ctx.clearRect(0, 0, s, s)
      const dark = p.theme === "dark"
      // light on dark, deeper on light, so the spectrum reads on either
      const lightness = dark ? 66 : 48
      const base = s * 0.5 * 0.56 * (1 + voice * 0.06)
      const count = Math.max(1, Math.round(p.rings))
      ctx.lineJoin = "round"
      // light adds up on a dark page, which suits the spectrum but would wash the theme colours out to white
      if (dark && !p.themed) ctx.globalCompositeOperation = "lighter"

      for (let i = 0; i < count; i++) {
        const k = count === 1 ? 0 : i / (count - 1)
        const radius = base * (1 - k * (p.ringGap * 4 + 0.16))
        // each ring leans a little less than the one outside it, which is what reads as depth
        const shift = side * presence * p.lean * s * 0.075 * (1 - k * 0.55)
        const lobes = 3 + (i % 3)
        const wobble = voice * p.deform * 0.11 * (1 - k * 0.3)
        const phase = clock * (0.8 + i * 0.17) * (i % 2 ? -1 : 1) + i * 1.9

        ctx.beginPath()
        const steps = 120
        for (let n = 0; n <= steps; n++) {
          const a = (n / steps) * TAU
          const r = radius * (1 + wobble * Math.sin(lobes * a + phase) + wobble * 0.4 * Math.sin((lobes + 2) * a - phase * 1.3))
          const x = c + shift + Math.cos(a) * r
          const y = c + Math.sin(a) * r
          n ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
        }
        ctx.closePath()

        const gradient = ctx.createConicGradient(spin + i * 0.5, c + shift, c)
        const alpha = 0.5 + 0.35 * (1 - k)
        const palette = p.themed ? themeColors.current : undefined
        if (palette) {
          // the four theme colours round the ring, back to the first so the seam closes
          for (let n = 0; n <= palette.length; n++) {
            const [r, g, b] = palette[n % palette.length]!
            gradient.addColorStop(n / palette.length, `rgb(${r} ${g} ${b} / ${alpha})`)
          }
        } else {
          for (let n = 0; n <= SEAM; n++) {
            const hue = (n / SEAM) * 360 + i * 14
            gradient.addColorStop(n / SEAM, `hsl(${hue % 360} 90% ${lightness}% / ${alpha})`)
          }
        }
        ctx.strokeStyle = gradient
        ctx.lineWidth = s * (0.012 + 0.012 * (1 - k)) * (1 + voice * 0.8)
        ctx.shadowBlur = p.halo * s * 0.06 * (0.5 + voice)
        ctx.shadowColor = dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.18)"
        ctx.stroke()
      }
      ctx.globalCompositeOperation = "source-over"
      ctx.shadowBlur = 0
      if (!still || clock === 0) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <canvas
      ref={canvas}
      role="img"
      aria-label={`Voice ring, ${state}`}
      className={cn("block", className)}
      style={{ width: size, height: size }}
    />
  )
}

export { VoiceRing }
export type { VoiceRingProps, VoiceRingState }
