import type { ComponentProps } from "react"
import { Crop as CropImpl } from "./crop"

export default {
  title: "Icon/Crop",
  component: CropImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Crop = (args: ComponentProps<typeof CropImpl>) => <CropImpl {...args} />
