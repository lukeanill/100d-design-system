import type { ComponentProps } from "react"
import { Volume2 as Volume2Impl } from "./volume-2"

export default {
  title: "Icon/Volume 2",
  component: Volume2Impl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Volume2 = (args: ComponentProps<typeof Volume2Impl>) => <Volume2Impl {...args} />
