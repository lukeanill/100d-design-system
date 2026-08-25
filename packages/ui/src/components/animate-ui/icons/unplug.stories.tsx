import type { ComponentProps } from "react"
import { Unplug as UnplugImpl } from "./unplug"

export default {
  title: "Icon/Unplug",
  component: UnplugImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Unplug = (args: ComponentProps<typeof UnplugImpl>) => <UnplugImpl {...args} />
