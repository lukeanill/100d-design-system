import type { ComponentProps } from "react"
import { Pin as PinImpl } from "./pin"

export default { title: "Icon/Pin", component: PinImpl }

export const Pin = (args: ComponentProps<typeof PinImpl>) => <PinImpl {...args} />
