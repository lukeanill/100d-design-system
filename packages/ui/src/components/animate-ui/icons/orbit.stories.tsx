import type { ComponentProps } from "react"
import { Orbit as OrbitImpl } from "./orbit"

export default {
  title: "Icon/Orbit",
  component: OrbitImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Orbit = (args: ComponentProps<typeof OrbitImpl>) => <OrbitImpl {...args} />
