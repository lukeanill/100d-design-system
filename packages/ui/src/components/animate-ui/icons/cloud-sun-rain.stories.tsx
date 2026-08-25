import type { ComponentProps } from "react"
import { CloudSunRain as CloudSunRainImpl } from "./cloud-sun-rain"

export default {
  title: "Icon/Cloud Sun Rain",
  component: CloudSunRainImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const CloudSunRain = (args: ComponentProps<typeof CloudSunRainImpl>) => <CloudSunRainImpl {...args} />
