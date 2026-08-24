import type { ComponentProps } from "react"
import { TextHighlighter as TextHighlighterImpl } from "./text-highlighter"

export default { title: "Animation/Text Highlighter", component: TextHighlighterImpl }

export const TextHighlighter = (args: ComponentProps<typeof TextHighlighterImpl>) => <TextHighlighterImpl {...args} />
