import type { ComponentProps } from "react"
import { TypingText as TypingTextImpl } from "./typing"

export default {
  title: "Animation/Text/Reveal/Typing",
  component: TypingTextImpl,
  argTypes: {
    duration: { control: { type: "range", min: 20, max: 300, step: 10 } },
    delay: { control: { type: "range", min: 0, max: 2000, step: 100 } },
    holdDelay: { control: { type: "range", min: 200, max: 3000, step: 100 } },
    loop: { control: "boolean" },
  },
  args: { text: "Typing text appears one letter at a time", duration: 60, delay: 0, holdDelay: 1000, loop: true },
}

export const TypingTexts = (args: ComponentProps<typeof TypingTextImpl>) => <TypingTextImpl {...args} />
