import type { ComponentProps } from "react"
import { CirclePlus as CirclePlusImpl } from "./circle-plus"

export default { title: "Icon/Circle Plus", component: CirclePlusImpl }

export const CirclePlus = (args: ComponentProps<typeof CirclePlusImpl>) => <CirclePlusImpl {...args} />
