import type { ComponentProps } from "react"
import { Moon as MoonImpl } from "./moon"

export default {
  title: "Icon/Moon",
  component: MoonImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Moon = (args: ComponentProps<typeof MoonImpl>) => <MoonImpl {...args} />
