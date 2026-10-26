"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { motion } from "motion/react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@workspace/ui/lib/utils"
import { glass } from "@workspace/ui/lib/glass"

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-(--radius) border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap shadow-md transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // hover is the surface at 80%, which is exactly what bg-primary/80 was
        // while the surface is var(--primary), and follows the glass once a
        // theme turns it on
        default: `${glass("action")} text-primary-foreground hover:bg-[color-mix(in_oklab,var(--glass-surface),transparent_20%)]`,
        outline:
          "border-foreground bg-transparent hover:bg-muted aria-expanded:bg-muted",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "shadow-none hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "shadow-none text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs: "h-6 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        lg: "h-10 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-9",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const MotionButtonPrimitive = motion.create(ButtonPrimitive)

function Button({
  className,
  variant = "default",
  size = "default",
  tapScale = 0.95,
  ...props
}: Omit<
  ButtonPrimitive.Props,
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragLeave"
  | "onDragOver"
  | "onDrop"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "style"
> &
  VariantProps<typeof buttonVariants> & {
    tapScale?: number
  }) {
  return (
    <MotionButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      whileTap={{ scale: tapScale }}
      {...props}
    >
      {props.children}
    </MotionButtonPrimitive>
  )
}

export { Button, buttonVariants }
