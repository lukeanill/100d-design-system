"use client"

import { useState } from "react"
import type { FC, ReactNode } from "react"
import { motion } from "motion/react"
import { FilmScriptIcon, ScribbleIcon, SwatchesIcon } from "@phosphor-icons/react"

import { ThemedIcon } from "@workspace/ui/components/themed-icon"
import { SurfaceFill } from "@workspace/ui/components/themed-surface"

/* Icon + label segmented control, active tab as a soft pill floating in a
 * muted track. Ported from Watermelon UI's Fluid Tabs
 * (ui.watermelon.sh/animated-components/category/tabs), restyled onto our
 * tokens (react-icons swapped for Phosphor, already a dependency here). */

export interface FluidTabItem {
  id: string
  label: string
  icon: ReactNode
}

export interface FluidTabsProps {
  tabs?: FluidTabItem[]
  defaultActive?: string
  onChange?: (id: string) => void
}

const DEFAULT_TABS: FluidTabItem[] = [
  { icon: <ThemedIcon phosphor={SwatchesIcon} />, id: "look", label: "Look" },
  { icon: <ThemedIcon phosphor={ScribbleIcon} />, id: "feel", label: "Feel" },
  { icon: <ThemedIcon phosphor={FilmScriptIcon} />, id: "rules", label: "Rules" },
]

export const FluidTabs: FC<FluidTabsProps> = ({ tabs = DEFAULT_TABS, defaultActive = tabs[0]?.id, onChange }) => {
  const [active, setActive] = useState<string>(defaultActive)

  const handleChange = (id: string) => {
    setActive(id)
    onChange?.(id)
  }

  // Figma nav-bar: 44px high, 4px of padding to a tab, with the 1px outline centred on the edge, 2px between tabs;
  // a tab is 36px high with 12px at the sides, a 20px icon and 4px before the label
  return (
    <div className="relative isolate flex h-11 w-fit items-center gap-0.5 rounded-[min(var(--radius-outer-max),calc(var(--radius-inner)+4px))] outline-1 -outline-offset-[0.5px] outline-(--control-edge) p-1 shadow-sm transition-colors">
      <SurfaceFill />
      {tabs.map((tab) => {
        const isActive = active === tab.id

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleChange(tab.id)}
            className="group relative h-9 rounded-(--radius-inner) px-3 py-1.5 outline-none transition-[background-color] duration-(--motion-fast) ease-(--motion-transition-ease) hover:bg-(--control-hover)"
          >
            {isActive && (
              <motion.div
                layoutId="fluid-tabs-active-pill"
                transition={{ damping: 25, mass: 0.8, stiffness: 280, type: "spring" }}
                className="absolute inset-0 rounded-[inherit] bg-foreground"
              />
            )}

            <motion.div
              transition={{ duration: 0.3, ease: "easeOut" }}
              animate={{ filter: isActive ? ["blur(0px)", "blur(4px)", "blur(0px)"] : "blur(0px)" }}
              className={`relative z-10 flex h-full items-center gap-1 transition-colors duration-200 ${isActive ? "text-background" : "text-foreground"}`}
            >
              <span className="flex size-5 shrink-0 items-center justify-center overflow-clip">{tab.icon}</span>

              <span className="text-body-md whitespace-nowrap">{tab.label}</span>
            </motion.div>
          </button>
        )
      })}
    </div>
  )
}
