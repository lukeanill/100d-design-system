"use client"

import type { ComponentProps } from "react"

import { cn } from "@workspace/ui/lib/utils"
import { SurfaceFill } from "@workspace/ui/components/themed-surface"

/**
 * A card by the component guidelines: the theme's fill (solid, gradient or glass, light or dark), the
 * theme's outline, the `edges/md` corner and the card padding. Content goes inside as it would in any
 * container. The fill is clipped to the corner by its own layer, so the card itself does not clip, which
 * lets a popup that belongs to something inside it open past its edge.
 */
function ThemedCard({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="themed-card"
      className={cn(
        "relative isolate flex flex-col gap-4 rounded-(--edges-md) p-4 text-foreground shadow-xs outline-1 -outline-offset-[0.5px] outline-(--control-edge)",
        className
      )}
      {...props}
    >
      <SurfaceFill />
      {children}
    </div>
  )
}

export { ThemedCard }
