import type { ComponentProps } from "react"
import { Forklift as ForkliftImpl } from "./forklift"

export default {
  title: "Icon/Forklift",
  component: ForkliftImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Forklift = (args: ComponentProps<typeof ForkliftImpl>) => <ForkliftImpl {...args} />
