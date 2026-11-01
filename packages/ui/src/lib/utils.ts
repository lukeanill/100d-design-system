import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// The design system's type styles (text-md, text-md-bold, text-action-md, text-h1-pri, ...) each set a size, weight and line height.
// tailwind-merge is told they are one group that replaces, and is replaced by, a Tailwind font size, so the last one in a class list
// wins, and none is read as a text colour. text-xs, text-sm and text-lg are Tailwind's own font sizes
const STEPS = ["xs", "sm", "md", "lg"]
const SIZES = ["sm", "md", "lg"]
const HEADINGS = ["1", "2", "3", "4", "5", "6"]
const TYPE_STYLES = [
  "md",
  ...STEPS.flatMap((z) => [`${z}-bold`, `${z}-italic`]),
  ...SIZES.flatMap((z) => [`action-${z}`, `label-${z}`]),
  ...HEADINGS.flatMap((n) => [`h${n}-pri`, `h${n}-pri-bold`, `h${n}-sec`, `h${n}-sec-bold`]),
]

const twMerge = extendTailwindMerge<"type-style">({
  extend: {
    classGroups: { "type-style": [{ text: TYPE_STYLES }] },
    conflictingClassGroups: { "type-style": ["font-size", "font-weight", "leading"], "font-size": ["type-style"] },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
