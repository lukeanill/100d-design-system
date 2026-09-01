import type { ComponentProps } from "react"
import { ShimmeringText as ShimmeringTextImpl } from "./shimmering"

export default {
  title: "Animation/Text/Loops/Shimmering",
  component: ShimmeringTextImpl,
  argTypes: {
    duration: { control: { type: "range", min: 0.5, max: 3, step: 0.1 } },
    wave: { control: "boolean" },
    color: { control: "text" },
    shimmeringColor: { control: "text" },
  },
  args: {
    text: "Shimmering text",
    duration: 1.5,
    wave: false,
    color: "var(--color-neutral-500)",
    shimmeringColor: "var(--color-neutral-300)",
  },
}

export const ShimmeringTexts = (args: ComponentProps<typeof ShimmeringTextImpl>) => <ShimmeringTextImpl {...args} />
