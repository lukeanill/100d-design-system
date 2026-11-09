"use client"

import { useEffect, useRef, useState } from "react"
import { useFastTransition } from "@workspace/ui/hooks/use-fast-transition"
import type { FC, ReactNode } from "react"
import { AnimatePresence, LayoutGroup, motion } from "motion/react"
import { Search, X } from "lucide-react"

import { SurfaceFill } from "@workspace/ui/components/themed-surface"

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
  /** Called with the category's id when one is chosen. */
  onChange?: (id: string) => void
  className?: string
}

export const MorphingDiscoveryBar: FC<MorphingDiscoveryBarProps> = ({ categories, defaultActive, onChange, className = "" }) => {
  const fast = useFastTransition()
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
    <div className={`flex w-full flex-col items-center justify-center bg-transparent p-2 transition-colors duration-(--motion-duration) sm:p-4 ${className}`}>
      <div className="flex h-14 w-full max-w-full items-center justify-center">
        <LayoutGroup>
          <motion.div transition={fast} layout className={`flex max-w-full items-center gap-1.5 rounded-[min(var(--radius-outer-max),calc(var(--radius-button)+8px))] p-1.5 relative isolate sm:gap-3 sm:p-2`}>
            <SurfaceFill popup weight="medium" />
            <motion.div transition={fast}
              layout
              className={`relative flex h-11 items-center overflow-hidden rounded-(--radius-button) isolate outline-1 -outline-offset-[0.5px] outline-(--control-edge) shadow-sm transition-colors duration-(--motion-fast) ease-(--motion-transition-ease) ${
                isSearching ? "xs:w-64 w-[calc(100vw-80px)] sm:w-80" : "w-11"
              }`}
            >
              <div className="relative flex h-full w-full items-center justify-center px-3 sm:px-4">
                <motion.div transition={fast} layout="position">
                  <Search size={16} strokeWidth={2.25} className="shrink-0 text-foreground transition-colors duration-(--motion-fast) ease-(--motion-transition-ease)" />
                </motion.div>

                <AnimatePresence mode="wait">
                  {isSearching && (
                    <motion.input
                      key="search-input"
                      ref={inputRef}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      transition={fast}
                      placeholder="Search"
                      className="ml-2 w-full border-none bg-transparent text-sm font-[weight:var(--font-body-weight-action)] text-foreground outline-none placeholder:text-foreground/75 sm:text-base"
                      value={searchValue}
                      onChange={(event) => setSearchValue(event.target.value)}
                    />
                  )}
                </AnimatePresence>

                {!isSearching && <motion.button transition={fast} layoutId="discovery-search-click-overlay" aria-label="Open search" className="absolute inset-0 z-10 h-full w-full" onClick={() => setIsSearching(true)} />}
              </div>
            </motion.div>

            <AnimatePresence mode="popLayout">
              {!isSearching ? (
                <motion.div transition={fast}
                  key="categories-list"
                  layout
                  initial={{ filter: "blur(10px)", opacity: 0, scale: 0.9 }}
                  animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
                  exit={{ filter: "blur(10px)", opacity: 0, scale: 0.9 }}
                  className="flex h-11 items-center gap-1 overflow-hidden rounded-[min(var(--radius-outer-max),calc(var(--radius-button)+4px))] isolate outline-1 -outline-offset-[0.5px] outline-(--control-edge) shadow-sm p-1"
                >
                  {categories.map((cat) => {
                    const isActive = activeTab === cat.id

                    return (
                      <motion.button transition={fast}
                        key={cat.id}
                        layout
                        onClick={() => {
                          setActiveTab(cat.id)
                          onChange?.(cat.id)
                        }}
                        className={`relative z-0 flex h-full items-center gap-1.5 rounded-(--radius-button) px-3 text-sm font-[weight:var(--font-body-weight-emphasis)] tracking-tight whitespace-nowrap transition-colors duration-(--motion-fast) ease-(--motion-transition-ease) hover:bg-(--control-hover) ${isActive ? "text-primary-foreground" : "text-foreground"}`}
                      >
                        {isActive && (
                          <motion.div transition={fast}
                            layoutId="discovery-pill-bg"
                            className="absolute inset-0 z-[-1] rounded-[inherit] bg-primary shadow-xs"
                          />
                        )}
                        <span className="relative z-10 flex items-center">{cat.icon}</span>
                        <span className="relative z-10">{cat.label}</span>
                      </motion.button>
                    )
                  })}
                </motion.div>
              ) : (
                <motion.button transition={fast}
                  key="close-action"
                  layout
                  initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setIsSearching(false)
                    setSearchValue("")
                  }}
                  className="relative isolate flex h-11 w-11 shrink-0 outline-1 -outline-offset-[0.5px] outline-(--control-edge) shadow-sm items-center justify-center rounded-(--radius-button) text-foreground transition-colors duration-(--motion-fast) ease-(--motion-transition-ease)"
                >
                  <X size={16} strokeWidth={2.25} className="relative" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </div>
    </div>
  )
}
