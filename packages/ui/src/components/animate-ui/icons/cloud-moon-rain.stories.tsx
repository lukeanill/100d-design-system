import type { ComponentProps } from "react"
import { CloudMoonRain as CloudMoonRainImpl } from "./cloud-moon-rain"

export default {
  title: "Icon/Cloud Moon Rain",
  component: CloudMoonRainImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const CloudMoonRain = (args: ComponentProps<typeof CloudMoonRainImpl>) => <CloudMoonRainImpl {...args} />
