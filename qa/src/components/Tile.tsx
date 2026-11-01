import { StatCardItem } from "@workspace/ui/components/ui/stat-card"
import { cn } from "@workspace/ui/lib/utils"

import { Glass } from "./Glass"

/**
 * The Figma's stat tile: label above, value below, on a faint white gradient. It is the
 * design system's StatCardItem with its own contents; the overrides cover the `sm:` rules
 * the component carries, which would otherwise win above 640px.
 */
export function Tile({ label, value, className }: { label: string; value: string | number; className?: string }) {
  return (
    <StatCardItem
      stat={{}}
      className={cn(
        "relative isolate flex h-24 flex-col justify-between space-y-0 overflow-clip rounded-2xl border-0 bg-transparent bg-gradient-to-b from-white/[0.02] to-white/[0.02] p-6 text-base leading-[1.42] sm:space-y-0 sm:rounded-2xl sm:p-6",
        className,
      )}
    >
      <Glass />
      <p className="relative opacity-50">{label}</p>
      <p className="relative">{value}</p>
    </StatCardItem>
  )
}
