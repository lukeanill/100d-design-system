import type { ComponentProps } from "react"
import { ArrowLeft as ArrowLeftImpl } from "./arrow-left"

export default {
  title: "Icon/Arrow Left",
  component: ArrowLeftImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const ArrowLeft = (args: ComponentProps<typeof ArrowLeftImpl>) => <ArrowLeftImpl {...args} />
