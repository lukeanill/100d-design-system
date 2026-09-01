import type { ComponentProps } from "react"
import RandomLetterSwapForwardImpl from "./random-letter-swap-forward-anim"

export default {
  title: "Animation/Text/Hover/Random Letter Swap Forward Anim",
  component: RandomLetterSwapForwardImpl,
  argTypes: {
    staggerDuration: { control: { type: "range", min: 0, max: 0.3, step: 0.01 } },
    reverse: { control: "boolean" },
    transition: { control: false },
  },
  args: { label: "Hover me", staggerDuration: 0.02, reverse: true },
}

export const RandomLetterSwapForwardAnim = (args: ComponentProps<typeof RandomLetterSwapForwardImpl>) => <RandomLetterSwapForwardImpl {...args} />
