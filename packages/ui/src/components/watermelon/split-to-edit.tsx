"use client"

// Split To Edit, adapted from Watermelon UI
// (https://ui.watermelon.sh/animated-components/split-to-edit).
//
// A compact "1 Hr. 45 Min." readout that springs apart into two editable
// segments when clicked, and closes back up on save.
//
// Changes from the original:
// - Theme tokens (bg-muted, text-foreground) instead of hardcoded zinc, and
//   --radius for the corners, so it follows the active theme.
// - Phosphor icons, matching the rest of the design system.
// - maxHours, so the same control serves a duration (default, 0-99) or a
//   time of day (pass 23).
// - Labels are props, for translation.
// - Clicking away while open saves, rather than silently discarding the edit.
//   The original only saved on Enter or the check button, which loses the
//   value when someone types a time and then presses a form's Continue.
// - Real button semantics and accessible names on the inputs and button.
// - classNames and radius, so a product can restyle each part. The root
//   carries data-state="open|closed" and the group/split name, for styles
//   that differ between the two states.

import * as React from "react"
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Transition,
} from "motion/react"
import { CheckIcon, PencilSimpleIcon } from "@phosphor-icons/react"

import { cn } from "@workspace/ui/lib/utils"

export interface SplitToEditProps {
  hours?: number
  minutes?: number
  /** Upper bound for the hour segment: 99 for a duration, 23 for a time of day. */
  maxHours?: number
  onSave?: (hours: number, minutes: number) => void
  hourLabel?: string
  minuteLabel?: string
  editLabel?: string
  saveLabel?: string
  /** Show the hour with a leading zero, as a clock does ("09" not "9"). */
  padHours?: boolean
  disabled?: boolean
  className?: string
  /** Corner radius of the segments. Defaults to the theme's --radius. */
  radius?: string
  classNames?: {
    hours?: string
    minutes?: string
    action?: string
    button?: string
    input?: string
    label?: string
    icon?: string
  }
}

const expandedTransition: Transition = {
  type: "spring",
  stiffness: 450,
  damping: 25,
  mass: 2,
}
const collapsedTransition: Transition = {
  type: "spring",
  stiffness: 450,
  damping: 25,
  mass: 1,
}

function clamp(value: string, max: number): number {
  return Math.min(max, Math.max(0, parseInt(value, 10) || 0))
}

export function SplitToEdit({
  hours = 2,
  minutes = 30,
  maxHours = 99,
  onSave,
  hourLabel = "Hr.",
  minuteLabel = "Min.",
  editLabel = "Edit",
  saveLabel = "Save",
  padHours = false,
  disabled = false,
  className,
  radius = "var(--radius)",
  classNames,
}: SplitToEditProps) {
  const RADIUS = radius
  const format = React.useCallback(
    (h: number, m: number) => ({
      h: padHours ? String(h).padStart(2, "0") : String(h),
      m: String(m).padStart(2, "0"),
    }),
    [padHours]
  )

  const [isExpanded, setIsExpanded] = React.useState(false)
  // Draft values exist only while open; closed, the readout comes straight
  // from props, so a parent changing the value always shows up.
  const [tempHours, setTempHours] = React.useState("")
  const [tempMinutes, setTempMinutes] = React.useState("")
  const hoursInputRef = React.useRef<HTMLInputElement>(null)
  const rootRef = React.useRef<HTMLDivElement>(null)

  const shown = isExpanded
    ? { h: tempHours, m: tempMinutes }
    : format(hours, minutes)

  React.useEffect(() => {
    if (!isExpanded) return
    const t = setTimeout(() => {
      hoursInputRef.current?.focus()
      hoursInputRef.current?.select()
    }, 50)
    return () => clearTimeout(t)
  }, [isExpanded])

  const open = () => {
    if (disabled || isExpanded) return
    const current = format(hours, minutes)
    setTempHours(current.h)
    setTempMinutes(current.m)
    setIsExpanded(true)
  }

  const save = () => {
    const h = clamp(tempHours, maxHours)
    const m = clamp(tempMinutes, 59)
    setIsExpanded(false)
    onSave?.(h, m)
  }

  const cancel = () => setIsExpanded(false)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Closed, the field keeps focus after Escape or a save, so let the keys
    // that open a button open it too.
    if (!isExpanded) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        open()
      }
      return
    }
    if (e.key === "Enter") {
      e.preventDefault()
      save()
    }
    if (e.key === "Escape") cancel()
  }

  const handleBlur = (e: React.FocusEvent) => {
    if (!isExpanded) return
    if (rootRef.current?.contains(e.relatedTarget as Node | null)) return
    save()
  }

  const segmentClass = cn(
    "flex items-center justify-end gap-1 bg-muted px-1",
    disabled ? "cursor-not-allowed" : "cursor-pointer",
    isExpanded && "gap-2 px-2.5"
  )
  // Fonts are left to inherit from the root, so one class there restyles all.
  const inputClass = cn(
    "h-10 w-[2ch] bg-transparent text-center text-xl font-semibold text-foreground outline-none",
    classNames?.input
  )
  const labelClass = cn(
    "text-lg font-medium text-muted-foreground",
    classNames?.label
  )
  const iconClass = cn("size-5 text-muted-foreground", classNames?.icon)

  return (
    <MotionConfig
      transition={isExpanded ? expandedTransition : collapsedTransition}
    >
      <motion.div
        ref={rootRef}
        layout
        onBlur={handleBlur}
        aria-disabled={disabled || undefined}
        data-state={isExpanded ? "open" : "closed"}
        className={cn(
          "group/split flex items-center font-mono",
          isExpanded && "gap-2",
          disabled && "opacity-40",
          className
        )}
      >
        <motion.div
          layout
          animate={{
            borderTopLeftRadius: RADIUS,
            borderBottomLeftRadius: RADIUS,
            borderTopRightRadius: isExpanded ? RADIUS : 0,
            borderBottomRightRadius: isExpanded ? RADIUS : 0,
          }}
          className={cn(segmentClass, "pl-2", classNames?.hours)}
          onClick={open}
        >
          <motion.input
            ref={hoursInputRef}
            layout
            inputMode="numeric"
            aria-label={hourLabel}
            value={shown.h}
            onChange={(e) =>
              setTempHours(e.target.value.replace(/\D/g, "").slice(0, 2))
            }
            onFocus={open}
            readOnly={!isExpanded}
            disabled={disabled}
            onKeyDown={handleKeyDown}
            className={inputClass}
          />
          <motion.span layout className={labelClass}>
            {hourLabel}
          </motion.span>
        </motion.div>

        <motion.div
          layout
          animate={{
            borderTopLeftRadius: isExpanded ? RADIUS : 0,
            borderBottomLeftRadius: isExpanded ? RADIUS : 0,
            borderTopRightRadius: isExpanded ? RADIUS : 0,
            borderBottomRightRadius: isExpanded ? RADIUS : 0,
          }}
          className={cn(
            segmentClass,
            "will-change-transform",
            classNames?.minutes
          )}
          onClick={open}
        >
          <motion.input
            layout
            inputMode="numeric"
            aria-label={minuteLabel}
            value={shown.m}
            onChange={(e) =>
              setTempMinutes(e.target.value.replace(/\D/g, "").slice(0, 2))
            }
            readOnly={!isExpanded}
            disabled={disabled}
            tabIndex={isExpanded ? 0 : -1}
            onKeyDown={handleKeyDown}
            className={inputClass}
          />
          <motion.span layout className={labelClass}>
            {minuteLabel}
          </motion.span>
        </motion.div>

        <motion.div
          layout
          animate={{
            borderTopLeftRadius: isExpanded ? RADIUS : 0,
            borderBottomLeftRadius: isExpanded ? RADIUS : 0,
            borderTopRightRadius: RADIUS,
            borderBottomRightRadius: RADIUS,
          }}
          className={cn(
            "flex size-10 items-center justify-center bg-muted will-change-transform",
            classNames?.action
          )}
        >
          <button
            type="button"
            disabled={disabled}
            aria-label={isExpanded ? saveLabel : editLabel}
            onClick={isExpanded ? save : open}
            className={cn(
              "flex size-full cursor-pointer items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed",
              classNames?.button
            )}
            style={{ borderRadius: "inherit" }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={isExpanded ? "check" : "pen"}
                initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                transition={{ type: "spring", visualDuration: 0.25, bounce: 0 }}
                className="flex"
              >
                {isExpanded ? (
                  <CheckIcon className={iconClass} />
                ) : (
                  <PencilSimpleIcon className={iconClass} />
                )}
              </motion.span>
            </AnimatePresence>
          </button>
        </motion.div>
      </motion.div>
    </MotionConfig>
  )
}
