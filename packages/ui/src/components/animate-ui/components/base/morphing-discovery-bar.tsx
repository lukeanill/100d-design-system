"use client"

import { useEffect, useRef, useState } from "react"
import type { FC, ReactNode } from "react"
import { AnimatePresence, LayoutGroup, motion } from "motion/react"
import { Search, X } from "lucide-react"

/* A search icon that expands into a search field, paired with a separate
 * tab group. Ported from Watermelon UI's Morphing Discovery Bar
 * (ui.watermelon.sh/animated-components/category/tabs), restyled onto our
 * tokens. The active category always uses the same bg-foreground/
 * text-background pair the base Tabs component uses, rather than a
 * per-category accent color, so it reads consistently across all 9 themes
 * instead of shifting hue. */

export interface DiscoveryCategory {
  id: string
  label: string
  icon: ReactNode
}

export interface MorphingDiscoveryBarProps {
  categories: DiscoveryCategory[]
  defaultActive?: string
  className?: string
}

const transition = { damping: 32, mass: 1, stiffness: 520, type: "spring" } as const

export const MorphingDiscoveryBar: FC<MorphingDiscoveryBarProps> = ({ categories, defaultActive, className = "" }) => {
  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState(defaultActive ?? categories[0]?.id)
  const [searchValue, setSearchValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearching) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100)
      return () => clearTimeout(timer)
    }
  }, [isSearching])

  return (
    <div className={`flex w-full flex-col items-center justify-center bg-transparent p-2 transition-colors duration-500 sm:p-4 ${className}`}>
      <div className="flex h-14 w-full max-w-full items-center justify-center">
        <LayoutGroup>
          <motion.div layout transition={transition} className="flex max-w-full items-center gap-1.5 rounded-[32px] p-1.5 backdrop-blur-md sm:gap-3 sm:p-2">
            <motion.div
              layout
              transition={transition}
              className={`relative flex h-11 items-center overflow-hidden rounded-full border border-border bg-card shadow-xs transition-colors ${
                isSearching ? "xs:w-64 w-[calc(100vw-80px)] sm:w-80" : "w-11"
              }`}
            >
              <div className="flex h-full w-full items-center justify-center px-3 sm:px-4">
                <motion.div layout="position" transition={transition}>
                  <Search size={16} strokeWidth={2.25} className="shrink-0 text-foreground transition-colors" />
                </motion.div>

                <AnimatePresence mode="wait">
                  {isSearching && (
                    <motion.input
                      key="search-input"
                      ref={inputRef}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      transition={{ duration: 0.15 }}
                      placeholder="Search"
                      className="ml-2 w-full border-none bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-foreground/75 sm:text-base"
                      value={searchValue}
                      onChange={(event) => setSearchValue(event.target.value)}
                    />
                  )}
                </AnimatePresence>

                {!isSearching && <motion.button layoutId="discovery-search-click-overlay" className="absolute inset-0 z-10 h-full w-full" onClick={() => setIsSearching(true)} />}
              </div>
            </motion.div>

            <AnimatePresence mode="popLayout">
              {!isSearching ? (
                <motion.div
                  key="categories-list"
                  layout
                  initial={{ filter: "blur(10px)", opacity: 0, scale: 0.9 }}
                  animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
                  exit={{ filter: "blur(10px)", opacity: 0, scale: 0.9 }}
                  transition={transition}
                  className="flex h-11 items-center gap-1 overflow-hidden rounded-full border border-border bg-muted p-1"
                >
                  {categories.map((cat) => {
                    const isActive = activeTab === cat.id

                    return (
                      <motion.button
                        key={cat.id}
                        layout
                        onClick={() => setActiveTab(cat.id)}
                        className={`relative z-0 flex h-full items-center gap-1.5 rounded-full px-3 text-sm font-bold tracking-tight whitespace-nowrap transition-colors ${isActive ? "text-background" : "text-foreground/75"}`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="discovery-pill-bg"
                            className="absolute inset-0 z-[-1] rounded-full bg-foreground shadow-xs"
                            transition={transition}
                          />
                        )}
                        <span className="relative z-10 flex items-center">{cat.icon}</span>
                        <span className="relative z-10">{cat.label}</span>
                      </motion.button>
                    )
                  })}
                </motion.div>
              ) : (
                <motion.button
                  key="close-action"
                  layout
                  initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
                  transition={transition}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setIsSearching(false)
                    setSearchValue("")
                  }}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-xs transition-colors"
                >
                  <X size={16} strokeWidth={2.25} />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </div>
    </div>
  )
}
