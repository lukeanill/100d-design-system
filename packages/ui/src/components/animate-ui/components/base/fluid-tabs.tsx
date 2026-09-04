"use client"

import { useState } from "react"
import type { FC, ReactNode } from "react"
import { motion } from "motion/react"
import { Inbox, Landmark, PieChart } from "lucide-react"

/* Icon + label segmented control, active tab as a soft pill floating in a
 * muted track. Ported from Watermelon UI's Fluid Tabs
 * (ui.watermelon.sh/animated-components/category/tabs), restyled onto our
 * tokens (react-icons swapped for lucide-react, already a dependency here). */

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
  { icon: <Landmark size={22} />, id: "accounts", label: "Accounts" },
  { icon: <Inbox size={22} />, id: "deposits", label: "Deposits" },
  { icon: <PieChart size={22} />, id: "funds", label: "Funds" },
]

export const FluidTabs: FC<FluidTabsProps> = ({ tabs = DEFAULT_TABS, defaultActive = tabs[0]?.id, onChange }) => {
  const [active, setActive] = useState<string>(defaultActive)

  const handleChange = (id: string) => {
    setActive(id)
    onChange?.(id)
  }

  return (
    <div className="relative flex items-center gap-1 rounded-full border border-border bg-muted px-1 py-1 transition-colors sm:gap-2">
      {tabs.map((tab) => {
        const isActive = active === tab.id

        return (
          <button key={tab.id} type="button" onClick={() => handleChange(tab.id)} className="group relative rounded-full px-3 py-2.5 outline-none sm:px-4 sm:py-3.5">
            {isActive && (
              <motion.div
                layoutId="fluid-tabs-active-pill"
                transition={{ damping: 25, mass: 0.8, stiffness: 280, type: "spring" }}
                className="absolute inset-0 rounded-full border border-border bg-card shadow-xs"
              />
            )}

            <motion.div
              transition={{ duration: 0.3, ease: "easeOut" }}
              animate={{ filter: isActive ? ["blur(0px)", "blur(4px)", "blur(0px)"] : "blur(0px)" }}
              className={`relative z-10 flex items-center gap-1.5 transition-colors duration-200 sm:gap-3 ${isActive ? "font-bold text-foreground" : "font-semibold text-foreground/75"}`}
            >
              <motion.div
                animate={{ scale: isActive ? 1.03 : 1 }}
                transition={{ scale: { damping: 15, stiffness: 300, type: "spring" } }}
                className="flex shrink-0 items-center justify-center"
              >
                {tab.icon}
              </motion.div>

              <span className="text-sm tracking-tight whitespace-nowrap sm:text-base">{tab.label}</span>
            </motion.div>
          </button>
        )
      })}
    </div>
  )
}
