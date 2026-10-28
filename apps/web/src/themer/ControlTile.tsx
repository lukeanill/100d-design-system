import { CaretCircleUpIcon } from "@phosphor-icons/react"
import type { ReactNode } from "react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@workspace/ui/components/collapsible"
import { GlassLayer } from "@workspace/ui/components/liquid-glass"
import { cn } from "@workspace/ui/lib/utils"

/**
 * One group of Look controls: a glass tile with a title and a caret circle that
 * opens it to show its tokens. The Themer keeps one open at a time, so the
 * column stays short beside the preview.
 *
 * `lifted` is the lighter gradient the Figma gives the Shadow tile while it is
 * open, so the shadows drawn inside it can be seen.
 */
export function ControlTile({
  title,
  open,
  onOpenChange,
  lifted = false,
  roomy = false,
  children,
}: {
  title: string
  open: boolean
  onOpenChange: (open: boolean) => void
  lifted?: boolean
  /** The Feel page's tiles: 40 of padding all round, and 40 under the title. */
  roomy?: boolean
  children: ReactNode
}) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange} className="relative isolate overflow-clip rounded-2xl">
      <GlassLayer weight="soft" radius={16} />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-gradient-to-b transition-colors duration-300",
          lifted && open ? "from-white/[0.24] to-white/40" : "from-white/[0.02] to-white/[0.02]"
        )}
      />
      <CollapsibleTrigger
        className={cn(
          "relative flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          roomy ? "p-10" : "p-6"
        )}
      >
        <h3 className="text-[28px] leading-[1.14]">{title}</h3>
        <CaretCircleUpIcon size={32} aria-hidden className={cn("shrink-0 transition-transform duration-200", !open && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="relative h-[var(--collapsible-panel-height)] overflow-hidden transition-[height] duration-300 ease-out data-[ending-style]:h-0 data-[starting-style]:h-0">
        <div className={roomy ? "px-10 pb-10" : "px-6 pb-6 pt-2"}>{children}</div>
      </CollapsibleContent>
    </Collapsible>
  )
}
