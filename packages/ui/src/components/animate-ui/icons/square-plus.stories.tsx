import type { ComponentProps } from "react"
import { SquarePlus as SquarePlusImpl } from "./square-plus"

export default { title: "Icon/Square Plus", component: SquarePlusImpl }

export const SquarePlus = (args: ComponentProps<typeof SquarePlusImpl>) => <SquarePlusImpl {...args} />
