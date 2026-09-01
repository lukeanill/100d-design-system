import type { ComponentProps } from "react"
import { HighlightText as HighlightTextImpl } from "./highlight"

export default {
  title: "Animation/Text/Loops/Highlight",
  component: HighlightTextImpl,
  argTypes: {
    delay: { control: { type: "range", min: 0, max: 2000, step: 100 } },
    transition: { control: false },
  },
  args: {
    text: "Highlighted text",
    delay: 0,
    style: { backgroundImage: "linear-gradient(120deg, #fde047 0%, #fde047 100%)" },
  },
}

export const HighlightTexts = (args: ComponentProps<typeof HighlightTextImpl>) => <HighlightTextImpl {...args} />
