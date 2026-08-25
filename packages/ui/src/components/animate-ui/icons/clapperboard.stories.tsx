import type { ComponentProps } from "react"
import { Clapperboard as ClapperboardImpl } from "./clapperboard"

export default {
  title: "Icon/Clapperboard",
  component: ClapperboardImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Clapperboard = (args: ComponentProps<typeof ClapperboardImpl>) => <ClapperboardImpl {...args} />
