import type { ReactNode } from "react"

import { cn } from "@workspace/ui/lib/utils"

/** A choice in the popover: 120 wide, outlined, and the chosen one has a heavier border. */
export function Choice({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        "flex w-[120px] items-center justify-center rounded-[8px] border-foreground p-4 text-base leading-[1.42] font-light",
        selected ? "border-2" : "border-[0.5px]",
      )}
    >
      {children}
    </button>
  )
}
