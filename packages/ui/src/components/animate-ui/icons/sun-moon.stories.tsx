import type { ComponentProps } from "react"
import { SunMoon as SunMoonImpl } from "./sun-moon"

export default {
  title: "Icon/Sun Moon",
  component: SunMoonImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const SunMoon = (args: ComponentProps<typeof SunMoonImpl>) => <SunMoonImpl {...args} />
