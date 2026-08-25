import type { ComponentProps } from "react"
import { Volume1 as Volume1Impl } from "./volume-1"

export default {
  title: "Icon/Volume 1",
  component: Volume1Impl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Volume1 = (args: ComponentProps<typeof Volume1Impl>) => <Volume1Impl {...args} />
