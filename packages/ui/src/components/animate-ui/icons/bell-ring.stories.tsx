import type { ComponentProps } from "react"
import { BellRing as BellRingImpl } from "./bell-ring"

export default { title: "Icon/Bell Ring", component: BellRingImpl }

export const BellRing = (args: ComponentProps<typeof BellRingImpl>) => <BellRingImpl {...args} />
