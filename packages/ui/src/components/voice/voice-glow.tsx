"use client"

import { useEffect, useLayoutEffect, useRef, useState, type ComponentProps } from "react"
import { VoiceBeam, useMicrophone } from "voice-glow"

import { observeTheme } from "@workspace/ui/lib/observe-theme"
import { useDocumentTheme } from "@workspace/ui/components/metal-surface"
import { hex, readThemeColors } from "./theme-colors"

type VoiceGlowProps = Omit<ComponentProps<typeof VoiceBeam>, "colorVariant"> & {
  /** The library's palettes, or "theme": the lobes wear the theme's primary, primary foreground, secondary and secondary foreground. */
  colorVariant?: ComponentProps<typeof VoiceBeam>["colorVariant"] | "theme"
}

/** The corner of the first element inside `root` that has one and fills it (the content's own outer box), in px; 0 when none does. */
function innerRadius(root: HTMLElement) {
  const { width, height } = root.getBoundingClientRect()
  const queue = [...root.children] as HTMLElement[]
  for (let depth = 0; queue.length && depth < 40; depth++) {
    const el = queue.shift()!
    // the beam's own layers are decoration; the content's corner is the one to follow
    if (el.getAttributeNames().some((name) => name.startsWith("data-voice-beam"))) continue
    const box = el.getBoundingClientRect()
    const radius = parseFloat(getComputedStyle(el).borderTopLeftRadius)
    if (radius >= 1 && box.width >= width * 0.9 && box.height >= height * 0.9) return radius
    queue.push(...(el.children as unknown as HTMLElement[]))
  }
  return 0
}

/**
 * The glow that rises from the bottom of a chat input or phone screen with a voice (the `voice-glow` library,
 * from libraries.dev, MIT). It follows the document's light or dark theme unless `theme` is set.
 *
 * - Give it a microphone `stream` (see `useMicrophone`), or drive it with `level` (0–1, or a getter sampled
 *   every frame).
 * - `type`: "default" for a chat input, "pill" for a recording pill, "mobile" for the bottom of a phone.
 */
function VoiceGlow({ theme, borderRadius, colorVariant, colors, ...props }: VoiceGlowProps) {
  const documentTheme = useDocumentTheme()
  const root = useRef<HTMLDivElement>(null)
  // the glow draws its edge in the corner of what it wraps, and finds that corner on the first child only, which
  // is often a plain wrapper; so the corner is measured from the first element that has one, once when it mounts
  // and again whenever the theme changes (never on every render: the beam's own layers must not feed back into it)
  const [measured, setMeasured] = useState<number | undefined>(undefined)
  useLayoutEffect(() => {
    if (borderRadius !== undefined || !root.current) return
    setMeasured(innerRadius(root.current) || undefined)
  }, [borderRadius])
  useEffect(() => observeTheme(root.current, () => root.current && setMeasured(innerRadius(root.current) || undefined)), [])
  // "theme": the four theme colours, read where the glow sits and again on a theme change. The lobes run centre
  // first and then in pairs outward, so each colour after the first takes a pair
  const [palette, setPalette] = useState<string[] | undefined>(undefined)
  const themed = colorVariant === "theme"
  useLayoutEffect(() => {
    if (!themed) return setPalette(undefined)
    const read = () => {
      const [p, pf, s, sf] = readThemeColors(root.current) ?? []
      setPalette(p && pf && s && sf ? [hex(p), hex(pf), hex(pf), hex(s), hex(s), hex(sf), hex(sf)] : undefined)
    }
    read()
    return observeTheme(root.current, read)
  }, [themed])
  return (
    <VoiceBeam
      ref={root}
      theme={theme ?? documentTheme}
      borderRadius={borderRadius ?? measured}
      colorVariant={themed ? undefined : colorVariant}
      colors={colors ?? palette}
      {...props}
    />
  )
}

export { VoiceGlow, useMicrophone }
