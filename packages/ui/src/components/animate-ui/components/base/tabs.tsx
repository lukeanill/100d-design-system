"use client"

import { createContext, useContext, useId, useState } from "react"
import type { ComponentProps, ReactNode } from "react"
import { LayoutGroup, motion } from "motion/react"

import { cn } from "@workspace/ui/lib/utils"

/* Sliding-pill tabs — ported from Watermelon UI's "Continuous Tabs"
 * (ui.watermelon.sh/animated-components/category/tabs), restyled onto our
 * tokens and wrapped in the same Tabs/TabsList/TabsTab/TabsPanels/TabsPanel
 * shape the previous Base-UI-backed implementation used, so existing usage
 * doesn't change. This version is a plain motion/react layoutId morph, not
 * Base UI: it renders `role="tablist"`/`role="tab"` but does not implement
 * roving-tabindex arrow-key navigation or ARIA-linked tabpanels. */

type TabsContextValue = {
  value: string | undefined
  setValue: (value: string) => void
  groupId: string
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const context = useContext(TabsContext)
  if (!context) throw new Error("Tabs components must be used within Tabs")
  return context
}

export interface TabsProps extends Omit<ComponentProps<"div">, "defaultValue" | "onChange"> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: ReactNode
}

function Tabs({ className, defaultValue, value, onValueChange, children, ...props }: TabsProps) {
  const groupId = useId()
  const [internalValue, setInternalValue] = useState(defaultValue)
  const isControlled = value !== undefined
  const activeValue = isControlled ? value : internalValue

  const setValue = (next: string) => {
    if (!isControlled) setInternalValue(next)
    onValueChange?.(next)
  }

  return (
    <TabsContext.Provider value={{ groupId, setValue, value: activeValue }}>
      <div data-slot="tabs" className={cn("flex flex-col gap-2", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export type TabsListProps = ComponentProps<"div">

function TabsList({ className, children, ...props }: TabsListProps) {
  const { groupId } = useTabsContext()
  return (
    <LayoutGroup id={groupId}>
      <div
        role="tablist"
        data-slot="tabs-list"
        className={cn("relative inline-flex w-fit items-center gap-1 rounded-full border border-border bg-muted p-1.5 shadow-xs", className)}
        {...props}
      >
        {children}
      </div>
    </LayoutGroup>
  )
}

export interface TabsTabProps extends Omit<ComponentProps<"button">, "value"> {
  value: string
}

function TabsTab({ className, value, children, onClick, ...props }: TabsTabProps) {
  const { value: activeValue, setValue } = useTabsContext()
  const isActive = activeValue === value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-slot="tabs-tab"
      data-state={isActive ? "active" : "inactive"}
      onClick={(event) => {
        setValue(value)
        onClick?.(event)
      }}
      className={cn(
        "focus-visible:border-ring focus-visible:ring-ring/50 relative inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {isActive && (
        <motion.span
          layoutId="tabs-active-pill"
          transition={{ damping: 30, mass: 0.9, stiffness: 380, type: "spring" }}
          className="absolute inset-0 rounded-full bg-foreground shadow-xs"
        />
      )}
      <motion.span layout="position" className={cn("relative z-10", isActive ? "text-background" : "text-foreground/75")}>
        {children}
      </motion.span>
    </button>
  )
}

export type TabsPanelsProps = ComponentProps<"div">

function TabsPanels({ className, ...props }: TabsPanelsProps) {
  return <div data-slot="tabs-panels" className={cn("flex-1", className)} {...props} />
}

export interface TabsPanelProps extends Omit<ComponentProps<"div">, "value"> {
  value: string
}

function TabsPanel({ className, value, ...props }: TabsPanelProps) {
  const { value: activeValue } = useTabsContext()
  if (activeValue !== value) return null

  return <div role="tabpanel" data-slot="tabs-panel" className={cn("outline-none", className)} {...props} />
}

export { Tabs, TabsList, TabsTab, TabsPanels, TabsPanel }
