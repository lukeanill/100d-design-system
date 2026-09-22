"use client"

import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"
import {
  GRADIENT_BACKGROUND_SCRIM_OPACITY,
  buildGradientBackgroundFallback,
  resolveGradientBackgroundConfig,
  type BalsaBackgroundConfig,
  type GradientBackgroundConfigInput,
  type GradientBackgroundPresetName,
} from "./gradient-background/gradient-background"
import { GradientBackgroundRenderer } from "./gradient-background/gradient-background-renderer"
import {
  createGradientBackgroundGlyphAtlas,
  type GradientBackgroundGlyphAtlas,
} from "./gradient-background/gradient-background-glyphs"

/**
 * A procedural WebGL background from Balsa UI (MIT), ported from its Vue
 * wrapper. The shader, renderer, glyphs and presets in ./gradient-background
 * are Balsa's files unchanged; only this component is ours.
 *
 * Decorative: hidden from assistive tech and transparent to the pointer, so it
 * sits behind content in a `relative isolate` parent. It pauses under
 * prefers-reduced-motion, when the tab is hidden and when scrolled out of
 * view, shows a CSS gradient until WebGL is ready (or if it never is), and
 * gives way to the system colour under forced-colors.
 *
 * Balsa's palette and theme integration is left out: it follows Balsa's own
 * theme tokens, which this design system does not use, and a config with
 * colorMode "custom" never reaches it.
 */
export interface GradientBackgroundProps {
  /** A generated configuration, e.g. from ./gradients. */
  config?: GradientBackgroundConfigInput
  /** A Balsa preset, used when no config is given. */
  preset?: GradientBackgroundPresetName
  /** Hold the current frame. */
  paused?: boolean
  /**
   * Paint with the active theme's colours instead of the config's own: the
   * theme's background, muted, secondary, accent and primary tokens, in that
   * order, following theme changes live. The config's motion, pattern and
   * effect are kept; ASCII and other duotone effects draw in primary on
   * background.
   */
  useThemeColors?: boolean
  /** Lay the page background over the field for legibility; true is 0.65. */
  scrim?: boolean | number
  scrimColor?: string
  className?: string
}

/** Theme tokens a background is painted from, darkest role last for most themes. */
const THEME_COLOR_TOKENS = ["--background", "--muted", "--secondary", "--accent", "--primary"]

/**
 * The theme's colours as seen from an element, as six-digit hex — Balsa only
 * takes hex, and the theme's tokens are oklch (or var() chains, which the
 * browser has already resolved by the time getComputedStyle returns them).
 * Joined into one string so useSyncExternalStore can compare snapshots.
 */
let probe: CanvasRenderingContext2D | null | undefined

function readThemeColors(element: Element | null): string {
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
  const colors = [...new Set(THEME_COLOR_TOKENS.map(hex).filter((c): c is string => Boolean(c)))]
  // a theme whose tokens collapse to one colour still needs two stops
  const foreground = hex("--foreground")
  if (colors.length < 2 && foreground && !colors.includes(foreground)) colors.push(foreground)
  return colors.length >= 2 ? colors.join(",") : ""
}

/**
 * Re-reads the theme colours whenever something that could change them does:
 * a theme class or inline tokens on the element or any ancestor (next-themes
 * sets a class on <html>; the theme studio paints tokens on a wrapper), or the
 * system colour scheme.
 */
function useThemeColors(ref: React.RefObject<HTMLElement | null>, enabled: boolean) {
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
    () => (enabled ? readThemeColors(ref.current) : ""),
    () => ""
  )
  return snapshot ? snapshot.split(",") : undefined
}

/**
 * The renderer and its animation loop, outside React: they change every frame
 * or on browser events, and re-rendering for them would cost more than the
 * shader does. The component creates one, feeds it configuration and pause
 * changes, and disposes of it.
 *
 * Each controller draws on a canvas of its own, created here and removed on
 * dispose. Balsa's renderer forces the WebGL context lost when disposed, and a
 * canvas whose context was lost never yields a new one — so a remount (React's
 * StrictMode mounts twice in development) must not reuse the old canvas.
 */
function createController(
  root: HTMLElement,
  host: HTMLElement,
  onStatus: (status: { ready: boolean; contextLost: boolean }) => void
) {
  const canvas = document.createElement("canvas")
  canvas.className = "block size-full"
  host.appendChild(canvas)
  let renderer: GradientBackgroundRenderer | undefined
  let glyphs: GradientBackgroundGlyphAtlas | undefined
  let glyphSignature = ""
  let configuration: BalsaBackgroundConfig | undefined
  let paused = false
  let contextLost = false
  let documentVisible = document.visibilityState !== "hidden"
  let inViewport = true
  let reducedMotion = false
  let animationFrame = 0
  let lastFrameTimestamp = 0
  let lastRenderTimestamp = 0
  let elapsedTime = 0

  // Rebuilt only when the ASCII effect's character set changes.
  const synchronizeGlyphs = () => {
    if (!configuration) return
    const { effect, effectCharacters } = configuration
    const signature = effect === "ascii" ? effectCharacters : ""
    if (signature === glyphSignature) return
    glyphSignature = signature
    glyphs?.dispose()
    glyphs = signature ? createGradientBackgroundGlyphAtlas(signature) : undefined
  }

  const renderStill = () => {
    if (!renderer || contextLost || !configuration) return
    renderer.render(elapsedTime * configuration.speed)
  }

  const shouldAnimate = () =>
    Boolean(renderer && !contextLost && !paused && !reducedMotion && documentVisible && inViewport)

  const loop = (timestamp: number) => {
    animationFrame = 0
    if (!shouldAnimate() || !renderer || !configuration) return
    const delta = lastFrameTimestamp ? Math.min(0.1, (timestamp - lastFrameTimestamp) / 1000) : 0
    lastFrameTimestamp = timestamp
    elapsedTime += delta
    const interval = 1000 / renderer.framesPerSecond
    if (!lastRenderTimestamp || timestamp - lastRenderTimestamp >= interval) {
      renderer.render(elapsedTime * configuration.speed)
      lastRenderTimestamp = timestamp
    }
    animationFrame = requestAnimationFrame(loop)
  }

  const synchronizeAnimation = () => {
    if (shouldAnimate()) {
      if (!animationFrame) animationFrame = requestAnimationFrame(loop)
      return
    }
    if (animationFrame) cancelAnimationFrame(animationFrame)
    animationFrame = 0
    lastFrameTimestamp = 0
    lastRenderTimestamp = 0
    renderStill()
  }

  const resize = (width?: number, height?: number) => {
    if (!renderer) return
    const bounds = root.getBoundingClientRect()
    renderer.resize(width ?? bounds.width, height ?? bounds.height)
    renderStill()
  }

  const createRenderer = () => {
    if (!configuration) return
    try {
      renderer?.dispose()
      synchronizeGlyphs()
      renderer = new GradientBackgroundRenderer(canvas, configuration, configuration.colors, glyphs)
      resize()
      contextLost = false
      onStatus({ ready: true, contextLost: false })
      synchronizeAnimation()
    } catch {
      // no WebGL: the CSS gradient underneath stays in place
      renderer?.dispose()
      renderer = undefined
      onStatus({ ready: false, contextLost: false })
    }
  }

  const update = () => {
    if (!renderer || !configuration) return
    synchronizeGlyphs()
    renderer.update(configuration, configuration.colors, glyphs)
    resize()
    synchronizeAnimation()
  }

  const onVisibility = () => {
    documentVisible = document.visibilityState !== "hidden"
    synchronizeAnimation()
  }
  const onMotion = (event: MediaQueryListEvent | MediaQueryList) => {
    reducedMotion = event.matches
    synchronizeAnimation()
  }
  const onContextLost = (event: Event) => {
    event.preventDefault()
    contextLost = true
    onStatus({ ready: true, contextLost: true })
    synchronizeAnimation()
  }
  const onContextRestored = () => {
    try {
      contextLost = false
      update()
      renderStill()
      onStatus({ ready: true, contextLost: false })
    } catch {
      onStatus({ ready: false, contextLost: false })
      requestAnimationFrame(createRenderer)
    }
  }

  canvas.addEventListener("webglcontextlost", onContextLost)
  canvas.addEventListener("webglcontextrestored", onContextRestored)
  document.addEventListener("visibilitychange", onVisibility)

  // Not every DOM this mounts in has matchMedia or the observers (jsdom does
  // not); without them it still renders, it just does not pause or resize.
  const motionQuery =
    typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : undefined
  if (motionQuery) {
    reducedMotion = motionQuery.matches
    motionQuery.addEventListener("change", onMotion)
  }
  const resizeObserver =
    typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(([entry]) => {
          if (entry) resize(entry.contentRect.width, entry.contentRect.height)
        })
      : undefined
  resizeObserver?.observe(root)
  const intersectionObserver =
    typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(
          ([entry]) => {
            inViewport = entry?.isIntersecting ?? true
            synchronizeAnimation()
          },
          { rootMargin: "96px" }
        )
      : undefined
  intersectionObserver?.observe(root)

  return {
    setConfiguration(next: BalsaBackgroundConfig) {
      configuration = next
      if (renderer) update()
      else createRenderer()
    },
    setPaused(next: boolean) {
      paused = next
      synchronizeAnimation()
    },
    dispose() {
      if (animationFrame) cancelAnimationFrame(animationFrame)
      animationFrame = 0
      resizeObserver?.disconnect()
      intersectionObserver?.disconnect()
      motionQuery?.removeEventListener("change", onMotion)
      document.removeEventListener("visibilitychange", onVisibility)
      canvas.removeEventListener("webglcontextlost", onContextLost)
      canvas.removeEventListener("webglcontextrestored", onContextRestored)
      canvas.remove()
      renderer?.dispose()
      renderer = undefined
      glyphs?.dispose()
      glyphs = undefined
    },
  }
}

export function GradientBackground({
  config,
  preset,
  paused = false,
  useThemeColors: themed = false,
  scrim = false,
  scrimColor = "var(--background)",
  className,
}: GradientBackgroundProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const canvasHostRef = React.useRef<HTMLDivElement>(null)
  const controllerRef = React.useRef<ReturnType<typeof createController> | null>(null)
  const [{ ready, contextLost }, setStatus] = React.useState({ ready: false, contextLost: false })

  const themeColors = useThemeColors(rootRef, themed)
  const themeKey = themeColors?.join(",")

  const configuration = React.useMemo<BalsaBackgroundConfig>(() => {
    const colors = themeKey?.split(",")
    return resolveGradientBackgroundConfig({
      preset,
      config,
      overrides: colors
        ? {
            colorMode: "custom",
            colors,
            // duotone and ink effects (ASCII) draw with their own pair
            effectInk: colors[colors.length - 1],
            effectPaper: colors[0],
          }
        : undefined,
    })
  }, [preset, config, themeKey])

  React.useEffect(() => {
    if (!rootRef.current || !canvasHostRef.current) return
    const controller = createController(rootRef.current, canvasHostRef.current, setStatus)
    controllerRef.current = controller
    return () => {
      controller.dispose()
      controllerRef.current = null
    }
  }, [])

  // Declared after the controller effect, so on mount they run once it exists.
  React.useEffect(() => {
    controllerRef.current?.setConfiguration(configuration)
  }, [configuration])

  React.useEffect(() => {
    controllerRef.current?.setPaused(paused)
  }, [paused])

  const showCanvas = ready && !contextLost
  const scrimOpacity =
    scrim === true
      ? GRADIENT_BACKGROUND_SCRIM_OPACITY
      : typeof scrim === "number" && Number.isFinite(scrim)
        ? Math.min(1, Math.max(0, scrim))
        : 0

  return (
    <div
      ref={rootRef}
      data-slot="gradient-background"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 isolate overflow-hidden forced-colors:bg-[Canvas]",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-0 transition-opacity",
          showCanvas ? "opacity-0" : "opacity-100"
        )}
        style={{
          backgroundImage: buildGradientBackgroundFallback(
            configuration.colors,
            configuration.direction
          ),
        }}
      />
      <div
        ref={canvasHostRef}
        className={cn(
          "absolute inset-0 block size-full transition-opacity forced-colors:hidden",
          showCanvas ? "opacity-100" : "opacity-0"
        )}
      />
      {scrimOpacity > 0 && (
        <div
          data-slot="gradient-background-scrim"
          className="absolute inset-0"
          style={{ backgroundColor: scrimColor, opacity: scrimOpacity }}
        />
      )}
    </div>
  )
}
