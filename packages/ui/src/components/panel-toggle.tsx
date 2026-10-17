import type { ReactNode } from "react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@workspace/ui/lib/utils"
import { ControlButton } from "@workspace/ui/components/control-button"

/**
 * The button that opens an overlay panel: a round icon control while closed, a "Close" pill
 * while open (`closeLabel` — e.g. "Skip" for a walkthrough). The label swaps with a short slide.
 */
type PanelToggleProps = {
  open: boolean
  onClick?: () => void
  /** Shown while closed. */
  icon: ReactNode
  /** Accessible name while closed. */
  label: string
  closeLabel?: string
  metal?: boolean
  className?: string
}

function PanelToggle({ open, onClick, icon, label, closeLabel = "Close", metal = false, className }: PanelToggleProps) {
  return (
    <ControlButton
      shape={open ? "pill" : "circle"}
      size={open ? "lg" : "default"}
      metal={metal}
      onClick={onClick}
      aria-expanded={open}
      aria-label={open ? undefined : label}
      data-slot="panel-toggle"
      className={cn(className)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={open ? "close" : "icon"}
          className="flex items-center"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
        >
          {open ? closeLabel : icon}
        </motion.span>
      </AnimatePresence>
    </ControlButton>
  )
}

export { PanelToggle }
export type { PanelToggleProps }
