import type { ComponentProps } from "react"
import { CloudSnow as CloudSnowImpl } from "./cloud-snow"

export default {
  title: "Icon/Cloud Snow",
  component: CloudSnowImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const CloudSnow = (args: ComponentProps<typeof CloudSnowImpl>) => <CloudSnowImpl {...args} />
