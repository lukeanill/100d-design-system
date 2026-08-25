import type { ComponentProps } from "react"
import { Loader as LoaderImpl } from "./loader"

export default {
  title: "Icon/Loader",
  component: LoaderImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Loader = (args: ComponentProps<typeof LoaderImpl>) => <LoaderImpl {...args} />
