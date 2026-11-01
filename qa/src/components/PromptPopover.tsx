import { useState, type CSSProperties, type RefObject } from "react"

import { Popover, PopoverPanel } from "@workspace/ui/components/animate-ui/components/base/popover"
import { LiquidGlass, glassProps } from "@workspace/ui/components/liquid-glass"

import { Choice } from "./Choice"
import { Glass } from "./Glass"

export type StatesMode = "defaults" | "all"

/**
 * The glass tile that opens from "Run": choose the states, see the estimate, and get the
 * prompt that starts the test in Claude Code. Clicking the prompt, or "Get test prompt",
 * copies it. Nothing is stored until Claude Code begins the test.
 *
 * Built the way the homepage's install panel is: the design system's Popover (it springs in
 * and closes on Escape or a click outside) around Heavy dark glass, with the command in a Soft
 * dark glass box. The Popover's own surface is switched off so the glass is the only one, and
 * the panel scales in without fading so the refraction is there from the first frame.
 */
export function PromptPopover({
  open,
  onOpenChange,
  anchor,
  mode,
  onMode,
  minutes,
  prompt,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The Run button: the panel opens over it. */
  anchor: RefObject<HTMLElement | null>
  mode: StatesMode
  onMode: (mode: StatesMode) => void
  minutes: number | null
  /** Null until a theme and a component are chosen. */
  prompt: string | null
}) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    if (!prompt) return
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next, details) => {
        // the Run button toggles the panel itself; its own press is not an outside click
        const target = (details as { event?: Event } | undefined)?.event?.target
        if (!next && target instanceof Element && target.closest("[data-popover-trigger]")) return
        onOpenChange(next)
      }}
    >
      <PopoverPanel
        anchor={anchor}
        side="bottom"
        align="end"
        sideOffset={({ anchor }) => -(anchor.height + 8)}
        alignOffset={-3}
        initialFocus={false}
        fade={false}
        className="w-[571px] rounded-[16px] border-0 p-0 shadow-none"
        style={{ "--glass-layer": "none", "--glass-surface": "transparent" } as CSSProperties}
      >
        <LiquidGlass radius={16} {...glassProps("heavy", "dark")} style={{ boxShadow: "0 24px 40px rgba(0, 0, 0, 0.25)" }}>
          <div className="flex animate-in flex-col items-start gap-6 p-10 duration-300 fade-in-0">
            <div className="flex w-full items-center gap-2">
              <p className="flex w-20 items-center justify-center rounded-[8px] py-4 pr-4 text-base leading-[1.42] font-light opacity-50">States</p>
              <div role="radiogroup" aria-label="States" className="flex gap-2">
                <Choice selected={mode === "defaults"} onClick={() => onMode("defaults")}>
                  Defaults
                </Choice>
                <Choice selected={mode === "all"} onClick={() => onMode("all")}>
                  All States
                </Choice>
              </div>
            </div>

            <div className="flex w-full items-center justify-between py-2">
              <p className="flex items-center justify-center rounded-[8px] py-4 pr-4 text-base leading-[1.42] font-light opacity-50">
                {minutes === null ? "Est. –" : `Est. ${minutes}m`}
              </p>
              <button type="button" onClick={copy} disabled={!prompt} className="text-xl leading-[1.42] font-bold disabled:opacity-50">
                Get test prompt
              </button>
            </div>

            <button
              type="button"
              onClick={copy}
              disabled={!prompt}
              className="relative isolate flex w-full items-center rounded-2xl p-6 text-left font-mono text-lg leading-[1.14] font-light text-chart-2"
            >
              <Glass tone="dark" />
              <span className="relative line-clamp-4 min-w-px flex-1 break-words">
                {copied ? "Copied to clipboard." : (prompt ?? "Choose a theme and at least one component.")}
              </span>
            </button>
          </div>
        </LiquidGlass>
      </PopoverPanel>
    </Popover>
  )
}
