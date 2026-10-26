"use client"

import * as React from "react"

import { buildMaps, supportsSvgBackdrop } from "@workspace/ui/lib/refraction"

/**
 * Refraction glass: an SVG filter used as a backdrop-filter. A canvas-drawn
 * displacement map bends what is behind the element along its bezel (a ray
 * refracted through a convex surface, by Snell's law), and a second map adds
 * a specular rim. The maps are sized to the element, so the filter is rebuilt
 * when it resizes.
 *
 * SVG backdrop filters only work in Chromium; elsewhere it falls back to a
 * plain backdrop blur.
 */

/** How strongly every glass catches the light at its rim, unless a surface asks otherwise: 0 is none, 1 is the Figma Glass sheet. */
export const GLASS_EDGE = 0.6

export type LiquidGlassProps = React.ComponentProps<"div"> & {
  /** Corner radius in px. */
  radius?: number
  /** Gaussian blur inside the refraction filter. */
  blur?: number
  /** Width of the refracting rim, in px. */
  bezel?: number
  /** How thick the glass is; thicker bends the rim further. */
  thickness?: number
  /** Refractive index of the glass. */
  ior?: number
  /** Multiplier on the displacement strength. */
  scaleRatio?: number
  specularOpacity?: number
  specularSaturation?: number
  /** How strongly the rim catches the light, from 0 (no rim) to 1 (the Figma Glass sheet); GLASS_EDGE by default. Scales the specular highlight and the inner glow together. */
  edge?: number
  /** Any CSS background: a colour or a gradient. */
  tint?: string
  /** Backdrop blur used where SVG backdrop filters are unavailable. */
  fallbackBlur?: number
}

export function LiquidGlass({
  radius = 16,
  blur = 0.3,
  bezel = 24,
  thickness = 40,
  ior = 3,
  scaleRatio = 1,
  specularOpacity = 0.5,
  specularSaturation = 4,
  edge = GLASS_EDGE,
  tint,
  fallbackBlur = 12,
  className,
  style,
  children,
  ...props
}: LiquidGlassProps) {
  const id = React.useId().replace(/:/g, "")
  const ref = React.useRef<HTMLDivElement>(null)
  const [size, setSize] = React.useState<[number, number]>([0, 0])
  const [supported] = React.useState(supportsSvgBackdrop)

  // before paint, so the refraction filter exists on the first frame rather than one frame later
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setSize([el.offsetWidth, el.offsetHeight])
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const [w, h] = size
  const maps = React.useMemo(
    () => (supported && w > 1 && h > 1 ? buildMaps(w, h, radius, thickness, bezel, ior, scaleRatio) : null),
    [supported, w, h, radius, thickness, bezel, ior, scaleRatio]
  )

  const fallback = `blur(${fallbackBlur}px)`
  const backdrop = maps ? `url(#${id})` : fallback

  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: "relative",
        isolation: "isolate",
        borderRadius: radius,
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.18)",
        ...style,
      }}
      {...props}
    >
      {maps && (
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <filter id={id} x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blurred" />
            <feImage href={maps.displacement} x="0" y="0" width={w} height={h} result="disp" />
            <feDisplacementMap in="blurred" in2="disp" scale={maps.scale} xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feColorMatrix in="displaced" type="saturate" values={String(specularSaturation)} result="displacedSat" />
            <feImage href={maps.specular} x="0" y="0" width={w} height={h} result="spec" />
            <feComposite in="displacedSat" in2="spec" operator="in" result="specMasked" />
            <feComponentTransfer in="spec" result="specFaded">
              <feFuncA type="linear" slope={specularOpacity * edge} />
            </feComponentTransfer>
            <feBlend in="specMasked" in2="displaced" mode="normal" result="withSat" />
            <feBlend in="specFaded" in2="withSat" mode="normal" />
          </filter>
        </svg>
      )}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          borderRadius: "inherit",
          backdropFilter: backdrop,
          WebkitBackdropFilter: backdrop,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          borderRadius: "inherit",
          pointerEvents: "none",
          boxShadow: `inset 0 0 20px -5px rgba(255, 255, 255, ${0.45 * edge})`,
          background: tint,
        }}
      />
      <div style={{ position: "relative", zIndex: 2, height: "100%" }}>{children}</div>
    </div>
  )
}

/**
 * The Glass sheet's weights and tones (Figma "Glass": Soft, Medium, Heavy across
 * Clear, Light, Dark, Tinted). Everything that wants the design system's glass
 * asks for one of these rather than choosing its own blur.
 */
const WEIGHTS = {
  soft: { blur: 1, bezel: 12, thickness: 20, scaleRatio: 0.5, specularOpacity: 0.8, fallbackBlur: 2, fill: 0.32, light: 0.16, dark: 0.4 },
  medium: { blur: 5, bezel: 30, thickness: 60, scaleRatio: 0.6, specularOpacity: 0.8, fallbackBlur: 10, fill: 0.4, light: 0.24, dark: 0.48 },
  heavy: { blur: 14, bezel: 28, thickness: 40, scaleRatio: 1, specularOpacity: 0.5, fallbackBlur: 40, fill: 0.48, light: 0.32, dark: 0.48 },
}

export type GlassWeight = keyof typeof WEIGHTS
type WeightValues = (typeof WEIGHTS)["soft"]

const TONES = {
  clear: () => undefined,
  light: (w: WeightValues) => `rgba(255, 255, 255, ${w.light})`,
  dark: (w: WeightValues) => `rgba(0, 0, 0, ${w.dark})`,
  tinted: (w: WeightValues) =>
    `linear-gradient(162deg, rgba(50, 205, 216, ${w.fill}) 42.7%, rgba(21, 61, 155, ${w.fill}) 93.1%)`,
}

export type GlassTone = keyof typeof TONES
export const glassWeights = Object.keys(WEIGHTS) as GlassWeight[]
export const glassTones = Object.keys(TONES) as GlassTone[]

/** The LiquidGlass props for a weight and tone; `tint` replaces the tone's fill when a surface has its own. */
export function glassProps(weight: GlassWeight, tone: GlassTone = "clear", tint?: string) {
  const { blur, bezel, thickness, scaleRatio, specularOpacity, fallbackBlur } = WEIGHTS[weight]
  return { blur, bezel, thickness, scaleRatio, specularOpacity, fallbackBlur, tint: tint ?? TONES[tone](WEIGHTS[weight]) }
}

/**
 * The glass as a layer behind a surface's content: fills the nearest positioned
 * ancestor (give it `relative` and its own radius), takes no clicks, and leaves
 * the content to paint above it. Content must come after it and be `relative`.
 */
export function GlassLayer({
  weight,
  tone,
  tint,
  radius = 16,
  edge,
}: {
  weight: GlassWeight
  tone?: GlassTone
  tint?: string
  radius?: number
  edge?: number
}) {
  return (
    <LiquidGlass
      aria-hidden="true"
      radius={radius}
      edge={edge}
      {...glassProps(weight, tone, tint)}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", boxShadow: "none" }}
    />
  )
}
