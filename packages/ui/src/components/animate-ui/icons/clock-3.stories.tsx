import type { ComponentProps } from "react"
import { Clock3 as Clock3Impl } from "./clock-3"

export default { title: "Icon/Clock 3", component: Clock3Impl }

export const Clock3 = (args: ComponentProps<typeof Clock3Impl>) => <Clock3Impl {...args} />
