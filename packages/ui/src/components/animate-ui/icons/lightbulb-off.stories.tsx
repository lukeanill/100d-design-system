import type { ComponentProps } from "react"
import { LightbulbOff as LightbulbOffImpl } from "./lightbulb-off"

export default {
  title: "Icon/Lightbulb Off",
  component: LightbulbOffImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const LightbulbOff = (args: ComponentProps<typeof LightbulbOffImpl>) => <LightbulbOffImpl {...args} />
