import type { ComponentProps } from "react"
import RandomLetterSwapPingPongImpl from "./random-letter-swap-pingpong-anim"

export default {
  title: "Animation/Text/Hover/Random Letter Swap Pingpong Anim",
  component: RandomLetterSwapPingPongImpl,
  argTypes: {
    staggerDuration: { control: { type: "range", min: 0, max: 0.3, step: 0.01 } },
    reverse: { control: "boolean" },
    transition: { control: false },
  },
  args: { label: "Hover me", staggerDuration: 0.02, reverse: true },
}

export const RandomLetterSwapPingpongAnim = (args: ComponentProps<typeof RandomLetterSwapPingPongImpl>) => <RandomLetterSwapPingPongImpl {...args} />
