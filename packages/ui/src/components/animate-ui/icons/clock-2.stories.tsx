import type { ComponentProps } from "react"
import { Clock2 as Clock2Impl } from "./clock-2"

export default { title: "Icon/Clock 2", component: Clock2Impl }

export const Clock2 = (args: ComponentProps<typeof Clock2Impl>) => <Clock2Impl {...args} />
