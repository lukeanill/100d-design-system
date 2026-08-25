import type { ComponentProps } from "react"
import { SunMedium as SunMediumImpl } from "./sun-medium"

export default {
  title: "Icon/Sun Medium",
  component: SunMediumImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const SunMedium = (args: ComponentProps<typeof SunMediumImpl>) => <SunMediumImpl {...args} />
