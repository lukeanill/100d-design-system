import type { ComponentProps } from "react"
import { LoaderCircle as LoaderCircleImpl } from "./loader-circle"

export default {
  title: "Icon/Loader Circle",
  component: LoaderCircleImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const LoaderCircle = (args: ComponentProps<typeof LoaderCircleImpl>) => <LoaderCircleImpl {...args} />
