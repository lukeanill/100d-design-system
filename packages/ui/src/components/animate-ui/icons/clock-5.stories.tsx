import type { ComponentProps } from "react"
import { Clock5 as Clock5Impl } from "./clock-5"

export default { title: "Icon/Clock 5", component: Clock5Impl }

export const Clock5 = (args: ComponentProps<typeof Clock5Impl>) => <Clock5Impl {...args} />
