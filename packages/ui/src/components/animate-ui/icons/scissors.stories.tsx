import type { ComponentProps } from "react"
import { Scissors as ScissorsImpl } from "./scissors"

export default {
  title: "Icon/Scissors",
  component: ScissorsImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Scissors = (args: ComponentProps<typeof ScissorsImpl>) => <ScissorsImpl {...args} />
