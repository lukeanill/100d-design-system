import type { ComponentProps } from "react"
import { SquareX as SquareXImpl } from "./square-x"

export default { title: "Icon/Square X", component: SquareXImpl }

export const SquareX = (args: ComponentProps<typeof SquareXImpl>) => <SquareXImpl {...args} />
