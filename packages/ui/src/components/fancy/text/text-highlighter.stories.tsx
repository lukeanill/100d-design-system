import type { ComponentProps } from "react"
import { TextHighlighter as TextHighlighterImpl } from "./text-highlighter"

export default {
  title: "Animation/Text/Loops/Text Highlighter",
  component: TextHighlighterImpl,
  argTypes: {
    children: { control: "text" },
    triggerType: { control: "select", options: ["hover", "ref", "inView", "auto"] },
    direction: { control: "select", options: ["ltr", "rtl", "ttb", "btt"] },
    highlightColor: { control: "color" },
  },
  args: {
    children: "This text gets highlighted",
    triggerType: "auto",
    direction: "ltr",
    highlightColor: "hsl(25, 90%, 80%)",
  },
}

export const TextHighlighter = (args: ComponentProps<typeof TextHighlighterImpl>) => <TextHighlighterImpl {...args} />
