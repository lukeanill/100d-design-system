import type { ComponentProps } from "react"
import { Lightbulb as LightbulbImpl } from "./lightbulb"

export default {
  title: "Icon/Lightbulb",
  component: LightbulbImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Lightbulb = (args: ComponentProps<typeof LightbulbImpl>) => <LightbulbImpl {...args} />
