import type { ComponentProps } from "react"
import { Blocks as BlocksImpl } from "./blocks"

export default {
  title: "Icon/Blocks",
  component: BlocksImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Blocks = (args: ComponentProps<typeof BlocksImpl>) => <BlocksImpl {...args} />
