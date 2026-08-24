import type { ComponentProps } from "react"
import { Clock6 as Clock6Impl } from "./clock-6"

export default { title: "Icon/Clock 6", component: Clock6Impl }

export const Clock6 = (args: ComponentProps<typeof Clock6Impl>) => <Clock6Impl {...args} />
