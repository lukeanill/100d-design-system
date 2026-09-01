import type { ComponentProps } from "react"
import LetterSwapPingPongImpl from "./letter-swap-pingpong-anim"

export default {
  title: "Animation/Text/Hover/Letter Swap Pingpong Anim",
  component: LetterSwapPingPongImpl,
  argTypes: {
    staggerFrom: { control: "select", options: ["first", "last", "center"] },
    staggerDuration: { control: { type: "range", min: 0, max: 0.3, step: 0.01 } },
    reverse: { control: "boolean" },
    transition: { control: false },
  },
  args: { label: "Hover me", staggerFrom: "first", staggerDuration: 0.03, reverse: true },
}

export const LetterSwapPingpongAnim = (args: ComponentProps<typeof LetterSwapPingPongImpl>) => <LetterSwapPingPongImpl {...args} />
