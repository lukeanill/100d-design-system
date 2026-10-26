import { useState } from "react"
import {
  CaretDownIcon,
  CaretUpIcon,
  CheckIcon,
  StarIcon,
  XIcon,
} from "@phosphor-icons/react"

import { presets } from "@workspace/ui/themes"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { Switch } from "@workspace/ui/components/animate-ui/components/base/switch"
import {
  Popover,
  PopoverPanel,
  PopoverTrigger,
} from "@workspace/ui/components/animate-ui/components/base/popover"

import { EDGE_OPTIONS, TEXT_SIZE_OPTIONS, type Styling } from "./styling"

const THEMES = presets

/** A quiet menu trigger: muted label and a caret that turns over when open. */
function MenuLabel({
  children,
  open,
}: {
  children: React.ReactNode
  open: boolean
}) {
  const Caret = open ? CaretUpIcon : CaretDownIcon
  return (
    <span className="text-body flex items-center gap-2 text-primary opacity-65">
      {children}
      <Caret weight="fill" className="size-2.5" />
    </span>
  )
}

function MenuHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-body px-3 pt-3 pb-1.5 leading-[1.2] text-primary opacity-50">
      {children}
    </p>
  )
}

function MenuRow({
  selected,
  onSelect,
  children,
}: {
  selected: boolean
  onSelect: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="text-body flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left leading-[1.2] text-primary hover:bg-foreground/5"
    >
      {children}
      {selected && <CheckIcon className="ml-auto size-5" />}
    </button>
  )
}

function StylingMenu({
  applied,
  onApply,
}: {
  applied: Styling
  onApply: (styling: Styling) => void
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(applied)
  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (next) setDraft(applied)
        setOpen(next)
      }}
    >
      <PopoverTrigger
        render={<button type="button" className="cursor-pointer" />}
      >
        <MenuLabel open={open}>Styling</MenuLabel>
      </PopoverTrigger>
      <PopoverPanel
        align="start"
        sideOffset={4}
        className="w-[220px] gap-0 overflow-clip rounded-2xl border border-black/[0.04] bg-card p-0 py-2 shadow-[0_16px_32px_-4px_rgba(12,12,13,0.1),0_4px_4px_-4px_rgba(12,12,13,0.05)]"
      >
        <MenuHeading>Edges</MenuHeading>
        {EDGE_OPTIONS.map((edge) => (
          <MenuRow
            key={edge.id}
            selected={draft.edges === edge.id}
            onSelect={() => setDraft({ ...draft, edges: edge.id })}
          >
            <span
              aria-hidden
              className={cn(
                "size-5 shrink-0 bg-muted",
                edge.id === "square" && "rounded-none",
                edge.id === "subtle" && "rounded-[4px]",
                edge.id === "strong" && "rounded-[6px]",
                edge.id === "round" && "rounded-full"
              )}
            />
            {edge.label}
          </MenuRow>
        ))}
        <MenuHeading>Fills</MenuHeading>
        <div className="text-body flex items-center justify-between px-3 py-1.5 text-primary">
          Glass Effect
          <Switch
            aria-label="Glass Effect"
            checked={draft.glass}
            onCheckedChange={(glass) => setDraft({ ...draft, glass })}
          />
        </div>
        <MenuHeading>Text Sizing</MenuHeading>
        {TEXT_SIZE_OPTIONS.map((size) => (
          <MenuRow
            key={size.id}
            selected={draft.textSize === size.id}
            onSelect={() => setDraft({ ...draft, textSize: size.id })}
          >
            {size.label}
          </MenuRow>
        ))}
        <div className="px-3 py-2">
          <Button
            className="h-10 w-full rounded-full bg-primary font-semibold tracking-[0.15px] text-card"
            onClick={() => {
              onApply(draft)
              setOpen(false)
            }}
          >
            Apply
          </Button>
        </div>
      </PopoverPanel>
    </Popover>
  )
}

/**
 * One theme as a button: a dot split between its paper and its ink, and its
 * name. The chosen one carries a star and a cross, and pressing it again puts
 * the page back to the theme it ships in.
 */
function ThemeButton({
  theme,
  selected,
  onPress,
}: {
  theme: (typeof THEMES)[number]
  selected: boolean
  onPress: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onPress}
      className={cn(
        "text-body flex shrink-0 cursor-pointer items-center justify-center gap-1.5 overflow-clip rounded-full border bg-card py-[3px] pr-[11px] pl-[3px] text-foreground transition-colors",
        selected ? "border-primary" : "border-card hover:border-foreground/20"
      )}
    >
      {/* the theme's own paper and ink, so the dot is the theme and not a picture of it */}
      <span
        aria-hidden
        className={cn(
          theme.id,
          "relative flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-background ring-1 ring-black/10"
        )}
      >
        <span className="absolute inset-0 bg-primary [clip-path:polygon(100%_0,100%_100%,0_100%)]" />
        {selected && (
          <StarIcon
            weight="fill"
            size={16}
            className="relative text-white mix-blend-difference"
          />
        )}
      </span>
      {theme.label}
      {selected && <XIcon size={16} className="-mr-1" />}
    </button>
  )
}

/** The Styling menu, then every theme as a row you can scroll sideways. Both act on the preview. */
export function PreviewMenus({
  themeId,
  onTheme,
  styling,
  onStyling,
}: {
  themeId: string | null
  onTheme: (id: string | null) => void
  styling: Styling
  onStyling: (styling: Styling) => void
}) {
  return (
    <div className="flex h-9 w-full min-w-0 items-center gap-8">
      <StylingMenu applied={styling} onApply={onStyling} />
      <div
        className="flex min-w-0 flex-1 gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="group"
        aria-label="Theme"
      >
        {THEMES.map((t) => (
          <ThemeButton
            key={t.id}
            theme={t}
            selected={themeId === t.id}
            onPress={() => onTheme(themeId === t.id ? null : t.id)}
          />
        ))}
      </div>
    </div>
  )
}
