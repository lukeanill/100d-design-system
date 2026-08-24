import type { ComponentProps } from "react"
import { CircleX as CircleXImpl } from "./circle-x"

export default { title: "Icon/Circle X", component: CircleXImpl }

export const CircleX = (args: ComponentProps<typeof CircleXImpl>) => <CircleXImpl {...args} />
