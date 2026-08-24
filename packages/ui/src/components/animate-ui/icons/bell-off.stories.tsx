import type { ComponentProps } from "react"
import { BellOff as BellOffImpl } from "./bell-off"

export default { title: "Icon/Bell Off", component: BellOffImpl }

export const BellOff = (args: ComponentProps<typeof BellOffImpl>) => <BellOffImpl {...args} />
