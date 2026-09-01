import type { ComponentProps } from "react"
import { MorphingText as MorphingTextImpl } from "./morphing"

export default {
  title: "Animation/Text/Loops/Morphing",
  component: MorphingTextImpl,
  argTypes: {
    loop: { control: "boolean" },
    holdDelay: { control: { type: "range", min: 500, max: 5000, step: 100 } },
    delay: { control: { type: "range", min: 0, max: 2000, step: 100 } },
    transition: { control: false },
  },
  args: { text: ["Morphing", "Animated", "Dynamic"], loop: true, holdDelay: 1500, delay: 0 },
}

export const MorphingTexts = (args: ComponentProps<typeof MorphingTextImpl>) => <MorphingTextImpl {...args} />
