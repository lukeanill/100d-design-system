import type { ComponentProps } from "react"
import { VolumeOff as VolumeOffImpl } from "./volume-off"

export default {
  title: "Icon/Volume Off",
  component: VolumeOffImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const VolumeOff = (args: ComponentProps<typeof VolumeOffImpl>) => <VolumeOffImpl {...args} />
