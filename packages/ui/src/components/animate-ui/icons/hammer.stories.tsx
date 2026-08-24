import type { ComponentProps } from "react"
import { Hammer as HammerImpl } from "./hammer"

export default { title: "Icon/Hammer", component: HammerImpl }

export const Hammer = (args: ComponentProps<typeof HammerImpl>) => <HammerImpl {...args} />
