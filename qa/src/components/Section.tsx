import { CaretCircleUpIcon } from "@phosphor-icons/react"
import { useState, type ReactNode } from "react"

import { cn } from "@workspace/ui/lib/utils"

/** A page section as the Figma sets it: a 28px heading with a caret that folds the content away. */
export function Section({ title, children, foldable = true }: { title: string; children: ReactNode; foldable?: boolean }) {
  const [open, setOpen] = useState(true)
  return (
    <section className="flex flex-col gap-10 pt-10">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-[28px] leading-[1.14] font-extralight">{title}</h2>
        {foldable && (
          <button type="button" aria-label={open ? `Collapse ${title}` : `Expand ${title}`} onClick={() => setOpen(!open)}>
            <CaretCircleUpIcon size={32} className={cn("transition-transform", !open && "-scale-y-100")} />
          </button>
        )}
      </div>
      {open && children}
    </section>
  )
}
