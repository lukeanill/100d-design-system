import type { ComponentProps } from "react"
import { MoonStar as MoonStarImpl } from "./moon-star"

export default {
  title: "Icon/Moon Star",
  component: MoonStarImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const MoonStar = (args: ComponentProps<typeof MoonStarImpl>) => <MoonStarImpl {...args} />
