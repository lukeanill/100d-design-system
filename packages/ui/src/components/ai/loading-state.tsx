"use client"

import { useEffect, useState } from "react"

import { cn } from "@workspace/ui/lib/utils"

/* Pixel-grid loader for long-running agent work, paired with a shimmering
 * label and a live elapsed timer. Reduced motion freezes the grid to its
 * dim state; the timer still ticks. Ported from beautifui.dev. */

const chevron = Array.from({ length: 9 }, (_, i) => {
  const r = Math.floor(i / 3)
  const c = i % 3
  return (c + Math.abs(r - 1)) * 90
})

const ORBIT_ORDER = [0, 1, 2, 5, 8, 7, 6, 3]
const orbit = Array.from({ length: 9 }, (_, i) => {
  const k = ORBIT_ORDER.indexOf(i)
  return k === -1 ? null : k * 110
})

const PATTERNS: Record<string, { delays: (number | null)[]; dur: number; round: boolean }> = {
  Dots: { delays: chevron, dur: 650, round: true },
  Drive: { delays: chevron, dur: 650, round: false },
  Orbit: { delays: orbit, dur: 950, round: false },
}

function LoaderGrid({ delays, dur, round }: { delays: (number | null)[]; dur: number; round: boolean }) {
  return (
    <span aria-hidden className="grid shrink-0 grid-cols-[repeat(3,4px)] gap-[1.5px]">
      {delays.map((delay, index) => (
        <span
          key={index}
          className={cn("size-[4px] bg-foreground", round ? "rounded-full" : "rounded-[1px]")}
          style={{
            animation: delay === null ? "none" : `pixel-on ${dur}ms ease-in-out ${delay}ms infinite`,
            opacity: delay === null ? 0.07 : 0.15,
          }}
        />
      ))}
    </span>
  )
}

function useElapsed() {
  const [ds, setDs] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setDs((d) => d + 1), 100)
    return () => clearInterval(t)
  }, [])
  const total = ds / 10
  if (total < 60) return `${total.toFixed(1)}s`
  return `${Math.floor(total / 60)}m ${(total % 60).toFixed(1)}s`
}

export interface LoadingStateProps {
  appearance?: {
    variant?: "Drive" | "Dots" | "Orbit"
  }
  data?: {
    label?: string
  }
  className?: string
}

export const LoadingState = ({ appearance, data, className }: LoadingStateProps = {}) => {
  const variant = appearance?.variant ?? "Drive"
  const elapsed = useElapsed()
  const label = data?.label ?? "Churning"
  const { delays, dur, round } = PATTERNS[variant] ?? PATTERNS.Drive

  return (
    <div role="status" className={cn("flex w-fit items-center gap-2.5", className)}>
      <LoaderGrid delays={delays} dur={dur} round={round} />
      <span
        className="bg-clip-text text-[13px] font-medium text-transparent"
        style={{
          animation: "shimmer-text 1.4s linear infinite",
          backgroundImage:
            "linear-gradient(90deg, var(--secondary-foreground) 35%, var(--foreground) 50%, var(--secondary-foreground) 65%)",
          backgroundSize: "200% 100%",
        }}
      >
        {label}
      </span>
      <span className="font-mono text-[12px] text-secondary-foreground tabular-nums">{elapsed}</span>
    </div>
  )
}
