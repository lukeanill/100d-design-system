import type { ComponentProps } from "react"
import { Clock1 as Clock1Impl } from "./clock-1"

export default { title: "Icon/Clock 1", component: Clock1Impl }

export const Clock1 = (args: ComponentProps<typeof Clock1Impl>) => <Clock1Impl {...args} />
