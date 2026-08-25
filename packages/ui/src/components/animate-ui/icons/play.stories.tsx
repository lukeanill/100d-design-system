import type { ComponentProps } from "react"
import { Play as PlayImpl } from "./play"

export default {
  title: "Icon/Play",
  component: PlayImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Play = (args: ComponentProps<typeof PlayImpl>) => <PlayImpl {...args} />
