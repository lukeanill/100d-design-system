import type { ComponentProps } from "react"
import { Cherry as CherryImpl } from "./cherry"

export default {
  title: "Icon/Cherry",
  component: CherryImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Cherry = (args: ComponentProps<typeof CherryImpl>) => <CherryImpl {...args} />
