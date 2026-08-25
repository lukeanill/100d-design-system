import type { ComponentProps } from "react"
import { CloudMoon as CloudMoonImpl } from "./cloud-moon"

export default {
  title: "Icon/Cloud Moon",
  component: CloudMoonImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const CloudMoon = (args: ComponentProps<typeof CloudMoonImpl>) => <CloudMoonImpl {...args} />
