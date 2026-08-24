import type { ComponentProps } from "react"
import { Clock8 as Clock8Impl } from "./clock-8"

export default { title: "Icon/Clock 8", component: Clock8Impl }

export const Clock8 = (args: ComponentProps<typeof Clock8Impl>) => <Clock8Impl {...args} />
