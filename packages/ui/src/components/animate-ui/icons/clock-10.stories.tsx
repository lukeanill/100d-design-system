import type { ComponentProps } from "react"
import { Clock10 as Clock10Impl } from "./clock-10"

export default { title: "Icon/Clock 10", component: Clock10Impl }

export const Clock10 = (args: ComponentProps<typeof Clock10Impl>) => <Clock10Impl {...args} />
