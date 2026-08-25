import type { ComponentProps } from "react"
import { Cast as CastImpl } from "./cast"

export default {
  title: "Icon/Cast",
  component: CastImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Cast = (args: ComponentProps<typeof CastImpl>) => <CastImpl {...args} />
