import type { ComponentProps } from "react"
import { CircuitBoard as CircuitBoardImpl } from "./circuit-board"

export default { title: "Icon/Circuit Board", component: CircuitBoardImpl }

export const CircuitBoard = (args: ComponentProps<typeof CircuitBoardImpl>) => <CircuitBoardImpl {...args} />
