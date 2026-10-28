"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import type { ComponentType, Ref, SVGProps } from "react"
import type { Icon as PhosphorIcon } from "@phosphor-icons/react"

import { cn } from "@workspace/ui/lib/utils"
import { observeTheme } from "@workspace/ui/lib/observe-theme"

/**
 * A Phosphor icon drawn at the theme's icon weight, in a 20 × 20 box (the Figma `eg/icons` size).
 *
 * A theme writes its weight as a custom property (`--theme-icon-weight`), so the icon reads it where
 * it sits, which means a scoped preview that wears its own theme is followed too, and a change of
 * theme re-draws the icon without a re-render of its own.
 */
type IconWeight = "thin" | "light" | "regular" | "bold" | "fill" | "duotone"

const WEIGHTS = new Set<string>(["thin", "light", "regular", "bold", "fill", "duotone"])

type ThemedIconProps = Omit<SVGProps<SVGSVGElement>, "ref"> & {
  phosphor: PhosphorIcon
}

function readWeight(el: Element | null): IconWeight {
  if (!el) return "regular"
  const weight = getComputedStyle(el).getPropertyValue("--theme-icon-weight").trim()
  return WEIGHTS.has(weight) ? (weight as IconWeight) : "regular"
}

function ThemedIcon({ phosphor, className, ...props }: ThemedIconProps) {
  const Glyph = phosphor as ComponentType<SVGProps<SVGSVGElement> & { ref?: Ref<SVGSVGElement>; weight?: IconWeight }>
  const ref = useRef<SVGSVGElement>(null)
  const [weight, setWeight] = useState<IconWeight>("regular")

  // read again after every render, and whenever a theme is put on or taken off it or an ancestor
  useLayoutEffect(() => {
    const next = readWeight(ref.current)
    if (next !== weight) setWeight(next)
  })
  useEffect(() => observeTheme(ref.current, () => setWeight(readWeight(ref.current))), [])

  return <Glyph ref={ref} weight={weight} aria-hidden className={cn("size-5 shrink-0", className)} {...props} />
}

export { ThemedIcon }
export type { ThemedIconProps, IconWeight }
