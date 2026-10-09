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
  const [supported, setSupported] = React.useState(false)

  React.useEffect(() => {
    setSupported(supportsSvgBackdrop())
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
              <feFuncA type="linear" slope={specularOpacity} />
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
          boxShadow: "inset 0 0 20px -5px rgba(255, 255, 255, 0.45)",
          background: tint,
        }}
      />
      <div style={{ position: "relative", zIndex: 2, height: "100%" }}>{children}</div>
    </div>
  )
}
