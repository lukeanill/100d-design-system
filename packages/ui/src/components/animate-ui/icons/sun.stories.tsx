import type { ComponentProps } from "react"
import { Sun as SunImpl } from "./sun"

export default {
  title: "Icon/Sun",
  component: SunImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Sun = (args: ComponentProps<typeof SunImpl>) => <SunImpl {...args} />
