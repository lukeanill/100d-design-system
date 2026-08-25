import type { ComponentProps } from "react"
import { TextHighlighter as TextHighlighterImpl } from "./text-highlighter"

export default {
  title: "Animation/Text Highlighter",
  component: TextHighlighterImpl,
  args: { children: "This text gets highlighted", triggerType: "auto" },
}

export const TextHighlighter = (args: ComponentProps<typeof TextHighlighterImpl>) => <TextHighlighterImpl {...args} />
