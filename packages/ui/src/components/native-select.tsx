import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"
import { CaretDownIcon } from "@phosphor-icons/react"
import { ThemedIcon } from "@workspace/ui/components/themed-icon"

type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  size?: "sm" | "default"
  /** A chip by the component guidelines: the inner corner, the one text style, no fill (ghost), a hover wash and a themed caret. As wide as its longest option. */
  themed?: boolean
}

function NativeSelect({
  className,
  size = "default",
  themed = false,
  ...props
}: NativeSelectProps) {
  return (
    <div
      className={cn(
        "group/native-select relative w-fit has-[select:disabled]:opacity-50",
        themed &&
          "isolate rounded-(--radius-inner) text-foreground before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-(--control-hover) before:opacity-0 before:transition-opacity before:duration-(--motion-fast) before:ease-(--motion-transition-ease) before:content-[''] hover:before:opacity-100 focus-within:ring-2 focus-within:ring-ring",
        className
      )}
      data-slot="native-select-wrapper"
      data-size={size}
    >
      <select
        data-slot="native-select"
        data-size={size}
        className={
          themed
            ? "text-body-md h-9 w-full min-w-0 cursor-pointer appearance-none rounded-[inherit] border-0 bg-transparent py-1 pr-7 pl-2 text-inherit outline-none select-none disabled:pointer-events-none disabled:cursor-not-allowed"
            : "h-9 w-full min-w-0 appearance-none rounded-(--radius) border border-foreground bg-transparent py-2 pr-8 pl-3 text-sm transition-colors outline-none select-none selection:bg-primary selection:text-primary-foreground placeholder:text-foreground hover:bg-muted focus-visible:border-ring disabled:pointer-events-none disabled:cursor-not-allowed aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 data-[size=sm]:h-8 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
        }
        {...props}
      />
      {themed ? (
        <ThemedIcon phosphor={CaretDownIcon} className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 select-none" aria-hidden="true" data-slot="native-select-icon" />
      ) : (
        <CaretDownIcon className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-foreground/75 select-none" aria-hidden="true" data-slot="native-select-icon" />
      )}
    </div>
  )
}

function NativeSelectOption({
  className,
  ...props
}: React.ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
