import { GlassLayer, type GlassTone, type GlassWeight } from "@workspace/ui/components/liquid-glass"

// the same softer rim the homepage tiles use: these sit on a black page, where a full white rim reads too strong
const EDGE = 0.35

/**
 * The design system's glass as a layer behind a surface (Glass sheet: Soft, Medium, Heavy).
 * Give the surface `relative isolate` and its own radius, and put its content after this, `relative`.
 */
export function Glass({ radius = 16, weight = "soft", tone }: { radius?: number; weight?: GlassWeight; tone?: GlassTone }) {
  return <GlassLayer weight={weight} tone={tone} radius={radius} edge={EDGE} />
}
