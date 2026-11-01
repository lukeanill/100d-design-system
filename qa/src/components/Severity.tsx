import { cn } from "@workspace/ui/lib/utils"

import { RATINGS, type Rating } from "../../shared/grade"

/** The four severity colours, as the Figma fills them. */
export const SEVERITY_FILL: Record<Rating, string> = {
  perfect: "bg-[#1e7a1b]",
  minor: "bg-[#19596e]",
  major: "bg-[#987b37]",
  critical: "bg-[#931616]",
}

export const SEVERITY_LABEL: Record<Rating, string> = {
  perfect: "Perfect",
  minor: "Minor",
  major: "Major",
  critical: "Critical",
}

/**
 * The user's rating of a component: four outlined chips, and the chosen one fills with its
 * colour. Built to the Figma rather than from OptionList, whose item is a pill that
 * deselects on a second click and reports nothing until a Confirm.
 */
export function RatingChips({ value, onChange }: { value: Rating | null; onChange: (rating: Rating) => void }) {
  return (
    <div role="radiogroup" aria-label="Rating" className="flex items-center gap-1">
      {RATINGS.map((rating) => {
        const selected = value === rating
        return (
          <button
            key={rating}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(rating)}
            className={cn(
              "flex items-center justify-center rounded-[8px] px-1.5 py-0.5 text-base leading-[1.42] font-light",
              selected ? cn(SEVERITY_FILL[rating], "text-white") : "border-[0.5px] border-foreground",
            )}
          >
            {SEVERITY_LABEL[rating]}
          </button>
        )
      })}
    </div>
  )
}

/** A count on a component row: "Ma 14", filled for a severity, bare for the 👻 untested count. */
export function CountBadge({ label, count, severity }: { label: string; count: number; severity?: Rating }) {
  return (
    <div className={cn("flex items-center justify-center gap-0.5 rounded-[8px] px-1.5 py-0.5 text-sm leading-[1.42] text-white", severity && SEVERITY_FILL[severity])}>
      <span className="font-bold">{label}</span>
      <span className="italic">{count}</span>
    </div>
  )
}
