import type { ComponentProps } from "react"
import Letter3DSwapImpl from "./letter-3d-swap"

export default {
  title: "Animation/Text/Hover/Letter 3d Swap",
  component: Letter3DSwapImpl,
  argTypes: {
    staggerFrom: { control: "select", options: ["first", "last", "center", "random"] },
    staggerDuration: { control: { type: "range", min: 0, max: 0.3, step: 0.01 } },
    rotateDirection: { control: "select", options: ["top", "right", "bottom", "left"] },
    transition: { control: false },
  },
  args: { children: "Hover me", staggerFrom: "first", staggerDuration: 0.05, rotateDirection: "right" },
}

export const Letter3dSwap = (args: ComponentProps<typeof Letter3DSwapImpl>) => <Letter3DSwapImpl {...args} />
