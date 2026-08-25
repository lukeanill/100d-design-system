import type { ComponentProps } from "react"
import { CircuitBoard as CircuitBoardImpl } from "./circuit-board"

export default {
  title: "Icon/Circuit Board",
  component: CircuitBoardImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const CircuitBoard = (args: ComponentProps<typeof CircuitBoardImpl>) => <CircuitBoardImpl {...args} />
