import type { ComponentProps } from "react"
import { CloudSun as CloudSunImpl } from "./cloud-sun"

export default {
  title: "Icon/Cloud Sun",
  component: CloudSunImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const CloudSun = (args: ComponentProps<typeof CloudSunImpl>) => <CloudSunImpl {...args} />
