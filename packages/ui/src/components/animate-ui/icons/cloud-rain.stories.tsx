import type { ComponentProps } from "react"
import { CloudRain as CloudRainImpl } from "./cloud-rain"

export default {
  title: "Icon/Cloud Rain",
  component: CloudRainImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const CloudRain = (args: ComponentProps<typeof CloudRainImpl>) => <CloudRainImpl {...args} />
