import type { ComponentProps } from "react"
import { PinOff as PinOffImpl } from "./pin-off"

export default { title: "Icon/Pin Off", component: PinOffImpl }

export const PinOff = (args: ComponentProps<typeof PinOffImpl>) => <PinOffImpl {...args} />
