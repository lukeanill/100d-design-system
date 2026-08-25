import type { ComponentProps } from "react"
import { Compass as CompassImpl } from "./compass"

export default {
  title: "Icon/Compass",
  component: CompassImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Compass = (args: ComponentProps<typeof CompassImpl>) => <CompassImpl {...args} />
