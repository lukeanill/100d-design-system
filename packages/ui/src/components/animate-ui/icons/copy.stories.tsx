import type { ComponentProps } from "react"
import { Copy as CopyImpl } from "./copy"

export default {
  title: "Icon/Copy",
  component: CopyImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Copy = (args: ComponentProps<typeof CopyImpl>) => <CopyImpl {...args} />
