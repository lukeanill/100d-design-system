import type { ComponentProps } from "react"
import {
  RotatingTextContainer as RotatingTextContainerImpl,
  RotatingText as RotatingTextImpl,
} from "./rotating"

export default {
  title: "Animation/Text/Loops/Rotating",
  component: RotatingTextContainerImpl,
  argTypes: {
    duration: { control: { type: "range", min: 500, max: 5000, step: 100 } },
    y: { control: { type: "range", min: -100, max: 100, step: 10 } },
    delay: { control: { type: "range", min: 0, max: 2000, step: 100 } },
  },
  args: { text: ["Rotating", "Animated", "Dynamic"], duration: 2000, y: -50, delay: 0 },
}

export const RotatingTexts = (args: ComponentProps<typeof RotatingTextContainerImpl>) => (
  <RotatingTextContainerImpl {...args}>
    <RotatingTextImpl />
  </RotatingTextContainerImpl>
)
