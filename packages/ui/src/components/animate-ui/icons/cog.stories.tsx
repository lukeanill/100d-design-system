import type { ComponentProps } from "react"
import { Cog as CogImpl } from "./cog"

export default {
  title: "Icon/Cog",
  component: CogImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Cog = (args: ComponentProps<typeof CogImpl>) => <CogImpl {...args} />
