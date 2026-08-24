import type { ComponentProps } from "react"
import { Binary as BinaryImpl } from "./binary"

export default { title: "Icon/Binary", component: BinaryImpl }

export const Binary = (args: ComponentProps<typeof BinaryImpl>) => <BinaryImpl {...args} />
