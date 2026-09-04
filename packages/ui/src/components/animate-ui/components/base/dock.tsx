"use client"

import { useState } from "react"
import type { FC, ReactNode } from "react"
import { motion, type Transition } from "motion/react"
import { Bell, FileText, Search, Settings, SquarePlus } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

/* An animated dock inspired by the macOS dock — icons lift on hover and pop
 * on click. Ported from Watermelon UI's Dock Component
 * (ui.watermelon.sh/animated-components/dock), restyled onto our tokens
 * (@hugeicons swapped for lucide-react, already a dependency here). */

export interface DockItem {
  id: number
  icon: ReactNode
}

export interface DockProps {
  items?: DockItem[]
}

const DEFAULT_DOCK_ITEMS: DockItem[] = [
  { icon: <Search size={16} />, id: 1 },
  { icon: <FileText size={16} />, id: 2 },
  { icon: <SquarePlus size={16} />, id: 3 },
  { icon: <Bell size={16} />, id: 4 },
  { icon: <Settings size={16} />, id: 5 },
]

const dockSpring: Transition = { damping: 22, mass: 0.7, stiffness: 300 }

export const Dock: FC<DockProps> = ({ items = DEFAULT_DOCK_ITEMS }) => {
  const [selected, setSelected] = useState<number | null>(null)
  const [animateSelected, setAnimateSelected] = useState<number | null>(null)

  const handleClick = (id: number) => {
    setSelected(id)
    setAnimateSelected(id)
    setTimeout(() => setAnimateSelected(null), 200)
  }

  return (
    <motion.div
      layout
      transition={dockSpring}
      className="relative flex w-fit items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1.5 shadow-xl"
    >
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="relative"
          onClick={() => handleClick(item.id)}
          style={{ transformOrigin: "bottom" }}
          initial={{ scale: 1 }}
          whileHover={{ y: -4 }}
          animate={{ scale: animateSelected === item.id ? 1.3 : 1, y: animateSelected === item.id ? -6 : 0 }}
          transition={{ damping: 15, mass: 1.1, stiffness: 550, type: "spring" }}
        >
          <div className={cn("flex cursor-pointer items-center justify-center p-2 transition-colors duration-200", selected === item.id ? "text-foreground" : "text-foreground/75")}>{item.icon}</div>

          <div className={cn("mt-px flex w-full items-center justify-center opacity-0 transition-opacity duration-400", selected === item.id && "opacity-100")}>
            <div className="size-1 rounded-full bg-foreground/40" />
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
