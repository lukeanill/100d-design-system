import type { ComponentProps, ReactNode } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@workspace/ui/lib/utils"
import { MetalSurface, type MetalEngine } from "@workspace/ui/components/metal-surface"

/**
 * Map-style controls, after the metal-fx demo on libraries.dev: a quiet glass surface normally,
 * a liquid-metal ring while the control is active (`metal`) — e.g. an open menu, playback, a
 * message being shown — with an optional wandering `halo`.
 *
 * - ControlButton: one control — `shape` "circle" (icon) or "pill" (text, optional icon).
 * - ControlGroup: several controls sharing one surface (e.g. zoom in / zoom out), each a
 *   ControlGroupItem.
 */
const controlButtonVariants = cva(
  "flex shrink-0 cursor-pointer items-center justify-center rounded-[var(--mfx-radius,var(--radius))] bg-transparent text-inherit outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-default disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      shape: {
        circle: "",
        pill: "text-body-md gap-2 px-4",
      },
      size: {
        default: "h-10 [&_svg]:size-5",
        lg: "h-11 [&_svg]:size-5",
      },
    },
    compoundVariants: [
      { shape: "circle", size: "default", className: "w-10" },
      { shape: "circle", size: "lg", className: "w-11" },
      { shape: "pill", size: "lg", className: "px-5" },
    ],
    defaultVariants: { shape: "circle", size: "default" },
  }
)

type ControlButtonProps = ComponentProps<"button"> &
  VariantProps<typeof controlButtonVariants> & {
    /** Ring the control in liquid metal (its active state). */
    metal?: boolean
    /** The wandering halo around the metal ring. */
    halo?: boolean
    engine?: MetalEngine
  }

function ControlButton({
  className,
  shape = "circle",
  size = "default",
  metal = false,
  halo = false,
  engine,
  type = "button",
  ...props
}: ControlButtonProps) {
  return (
    <MetalSurface variant={shape === "pill" ? "button" : "circle"} active={metal} halo={halo} engine={engine} themedFill>
      <button
        type={type}
        data-slot="control-button"
        data-metal={metal || undefined}
        className={cn(controlButtonVariants({ shape, size }), className)}
        {...props}
      />
    </MetalSurface>
  )
}

type ControlGroupProps = {
  children: ReactNode
  orientation?: "vertical" | "horizontal"
  metal?: boolean
  halo?: boolean
  engine?: MetalEngine
  className?: string
}

function ControlGroup({ children, orientation = "vertical", metal = false, halo = false, engine, className }: ControlGroupProps) {
  return (
    <MetalSurface variant="button" active={metal} halo={halo} engine={engine}>
      <div
        role="group"
        data-slot="control-group"
        data-orientation={orientation}
        className={cn("flex overflow-hidden rounded-[var(--mfx-radius,var(--radius))]", orientation === "vertical" ? "w-10 flex-col" : "h-10", className)}
      >
        {children}
      </div>
    </MetalSurface>
  )
}

function ControlGroupItem({ className, type = "button", ...props }: ComponentProps<"button">) {
  return (
    <button
      type={type}
      data-slot="control-group-item"
      className={cn(
        "flex size-10 cursor-pointer items-center justify-center bg-transparent text-inherit outline-none transition-colors hover:bg-black/5 focus-visible:bg-black/10 disabled:cursor-default disabled:opacity-45 dark:hover:bg-white/6 dark:focus-visible:bg-white/10 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

export { ControlButton, ControlGroup, ControlGroupItem, controlButtonVariants }
export type { ControlButtonProps, ControlGroupProps }
