"use client"

import { useEffect, useState } from "react"
import type { FC, ReactNode } from "react"
import { AnimatePresence, motion } from "motion/react"

/* Icon-only tabs that expand into a labeled pill when active, others
 * collapse to icon-only circles. Ported from Watermelon UI's Discrete Tabs
 * (ui.watermelon.sh/animated-components/category/tabs), restyled onto our
 * tokens; each tab's active color stays consumer-supplied since that's the
 * point of the pattern (a distinct accent per destination). */

export interface DiscreteTabItem {
  id: string
  icon: ReactNode
  label: string
  /** Text-color class applied to the icon and label when this tab is active, e.g. "text-primary". */
  activeColor: string
}

export interface DiscreteTabsProps {
  tabs: DiscreteTabItem[]
  onTabChange?: (tabId: string) => void
  defaultTab?: string
}

export const DiscreteTabs: FC<DiscreteTabsProps> = ({ tabs, onTabChange, defaultTab }) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0]?.id)
  const [shine, setShine] = useState<boolean>(false)

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    onTabChange?.(tabId)
  }

  useEffect(() => {
    const timer = setTimeout(() => setShine(true), 600)
    return () => {
      clearTimeout(timer)
      setShine(false)
    }
  }, [activeTab])

  return (
    <div className="mx-auto flex w-fit items-center justify-center gap-2 overflow-hidden rounded-full py-6">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button key={tab.id} type="button" onClick={() => handleTabClick(tab.id)} className="relative focus:outline-none">
            <motion.div
              layout="position"
              transition={{ damping: 18, mass: 1, stiffness: 210, type: "spring" }}
              className={`relative flex h-16 ${isActive ? "w-40" : "w-full"} items-center justify-center`}
            >
              {isActive && (
                <motion.div
                  layoutId="discrete-tabs-active-bg"
                  className="absolute inset-0 rounded-full bg-card shadow-md"
                  transition={{ damping: 26, stiffness: 220, type: "spring" }}
                />
              )}
              <div className="relative z-10 flex cursor-pointer items-center gap-1 pr-3">
                <motion.div
                  animate={{ scale: isActive ? 1.08 : 1 }}
                  className={`flex h-14 w-14 items-center justify-center rounded-full ${isActive ? tab.activeColor : "bg-muted text-foreground"}`}
                >
                  {tab.icon}
                </motion.div>
                <motion.span
                  animate={{ opacity: isActive ? 1 : 0, width: isActive ? "auto" : 0 }}
                  className={`relative overflow-hidden text-xl font-semibold whitespace-nowrap ${isActive ? tab.activeColor : "text-foreground"}`}
                >
                  {tab.label}
                  <AnimatePresence>
                    {isActive && shine && (
                      <motion.span
                        initial={{ left: "-120%" }}
                        animate={{ left: "120%" }}
                        className="absolute top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-background/60 to-transparent"
                      />
                    )}
                  </AnimatePresence>
                </motion.span>
              </div>
            </motion.div>
          </button>
        )
      })}
    </div>
  )
}
