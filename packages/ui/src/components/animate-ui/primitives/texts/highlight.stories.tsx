import type { ComponentProps } from "react"
import { HighlightText as HighlightTextImpl } from "./highlight"

export default { title: "Animation/Highlight (Texts)", component: HighlightTextImpl }

export const Highlight = (args: ComponentProps<typeof HighlightTextImpl>) => <HighlightTextImpl {...args} />
