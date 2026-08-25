import type { ComponentProps } from "react"
import { LoaderPinwheel as LoaderPinwheelImpl } from "./loader-pinwheel"

export default {
  title: "Icon/Loader Pinwheel",
  component: LoaderPinwheelImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const LoaderPinwheel = (args: ComponentProps<typeof LoaderPinwheelImpl>) => <LoaderPinwheelImpl {...args} />
