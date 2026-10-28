import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// `text-body-md` (and its siblings) is a type style (size, weight, line height), not a colour: without this, tailwind-merge
// reads it as a text colour and drops it, or the real colour beside it
const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: ["body-md", "body-sm", "heading-h3"] }] } },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
