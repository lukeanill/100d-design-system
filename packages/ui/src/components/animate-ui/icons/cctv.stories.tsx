import type { ComponentProps } from "react"
import { Cctv as CctvImpl } from "./cctv"

export default {
  title: "Icon/Cctv",
  component: CctvImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Cctv = (args: ComponentProps<typeof CctvImpl>) => <CctvImpl {...args} />
