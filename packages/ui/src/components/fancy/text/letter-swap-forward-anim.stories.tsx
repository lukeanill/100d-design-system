import type { ComponentProps } from "react"
import LetterSwapForwardImpl from "./letter-swap-forward-anim"

export default {
  title: "Animation/Text/Hover/Letter Swap Forward Anim",
  component: LetterSwapForwardImpl,
  argTypes: {
    staggerFrom: { control: "select", options: ["first", "last", "center"] },
    staggerDuration: { control: { type: "range", min: 0, max: 0.3, step: 0.01 } },
    reverse: { control: "boolean" },
    transition: { control: false },
  },
  args: { label: "Hover me", staggerFrom: "first", staggerDuration: 0.03, reverse: true },
}

export const LetterSwapForwardAnim = (args: ComponentProps<typeof LetterSwapForwardImpl>) => <LetterSwapForwardImpl {...args} />
