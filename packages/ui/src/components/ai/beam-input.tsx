"use client"

import { useId, useState } from "react"
import { BorderBeam } from "border-beam"
import type { ComponentProps, CSSProperties } from "react"
import { ArrowUpIcon } from "@phosphor-icons/react"

import { cn } from "@workspace/ui/lib/utils"
import { useTheme } from "@workspace/ui/components/theme-provider"
import { ThemedIcon } from "@workspace/ui/components/themed-icon"
import { SurfaceFill } from "@workspace/ui/components/themed-surface"
import { DEFAULT_THEME_ID, getPreset, presets } from "@workspace/ui/themes/presets"
import { themeStyle } from "@workspace/ui/themes/css"
import type { ColorMode, Material } from "@workspace/ui/themes/types"

/* A text input with a send button inside the border-beam package's BorderBeam (libraries.dev/beam). The bar
 * is the prompt bar's (fill, outline, radius, input and send button); the beam is the package's, unthemed. */

/** Motion and type pick one of the package's sizes: rotate is md or line, pulse is outside or inner. */
const SIZES = { rotate: { large: "md", line: "line" }, pulse: { large: "pulse-outside", line: "pulse-inner" } } as const

const usePageTheme = () => {
  try {
    return useTheme().theme
  } catch {
    return DEFAULT_THEME_ID
  }
}

/** The page's theme with the texture and colour mode swapped in, as an inline style that scopes it to one element. */
export function useScopedTheme(texture?: Material, colorMode?: ColorMode): CSSProperties | undefined {
  const pageTheme = getPreset(usePageTheme()) ?? presets[0]
  if (!texture && !colorMode) return undefined
  const mode = colorMode ?? pageTheme.colorMode
  // a light palette under a dark colour mode would be unreadable, so the palette comes from a preset of that mode
  const base = pageTheme.colorMode === mode ? pageTheme : (presets.find((t) => t.colorMode === mode) ?? pageTheme)
  return themeStyle({ ...base, colorMode: mode, material: texture ?? base.material }) as CSSProperties
}

export interface BeamInputProps extends Omit<ComponentProps<"form">, "onSubmit"> {
  /** What the bar is made of: the theme's solid, gradient or glass. Follows the page's theme when not set. */
  texture?: Material
  /** Light or dark. Follows the page's theme when not set. */
  colorMode?: ColorMode
  /** Rotate travels the border; pulse breathes. */
  motion?: "rotate" | "pulse"
  /** Large is the full border (rotate) or the outward bloom (pulse); line is the bottom line (rotate) or the contained breathe (pulse). */
  type?: "large" | "line"
  /** The package's own size; when set it wins over motion and type. */
  size?: "md" | "sm" | "line" | "pulse-inner" | "pulse-outside"
  colorVariant?: "colorful" | "mono" | "ocean" | "sunset"
  /** Glow intensity, 0 to 1. */
  strength?: number
  /** False pauses the beam. */
  active?: boolean
  placeholder?: string
  onSend?: (text: string) => void
}

export function BeamInput({ texture, colorMode, motion = "rotate", type = "large", size, colorVariant = "colorful", strength = 0.7, active = true, placeholder = "Write a message…", onSend, className, style, ...props }: BeamInputProps) {
  const id = useId()
  const [draft, setDraft] = useState("")
  const scope = useScopedTheme(texture, colorMode)
  const mode = colorMode ?? (getPreset(usePageTheme()) ?? presets[0]).colorMode
  const canSend = draft.trim().length > 0

  const send = () => {
    if (!canSend) return
    onSend?.(draft.trim())
    setDraft("")
  }

  return (
    <BorderBeam size={size ?? SIZES[motion][type]} colorVariant={colorVariant} strength={strength} theme={mode} active={active} className="w-full max-w-150" style={scope}>
    <form
      data-slot="beam-input"
      onSubmit={(event) => {
        event.preventDefault()
        send()
      }}
      className={cn(
        "relative isolate flex min-h-11 w-full items-end gap-1 p-1 text-foreground shadow-xs outline-1 -outline-offset-[0.5px] outline-(--control-edge)",
        "rounded-[min(var(--radius-outer-max),calc(var(--radius-button)+4px))]",
        className
      )}
      style={style}
      {...props}
    >
      <SurfaceFill />

      <input
        id={id}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={placeholder}
        aria-label="Message"
        className="text-md min-h-9 w-full min-w-0 flex-1 bg-transparent px-2 text-foreground outline-none placeholder:text-foreground/75"
      />
      <button
        type="submit"
        aria-label="Send"
        disabled={!canSend}
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-(--radius-button) transition-[background-color,color,transform] duration-200 enabled:active:scale-[0.94]",
          canSend ? "bg-foreground text-background" : "bg-border text-foreground/75"
        )}
      >
        <ThemedIcon phosphor={ArrowUpIcon} />
      </button>
    </form>
    </BorderBeam>
  )
}
