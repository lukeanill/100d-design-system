import type { ComponentProps } from "react"
import { Clock9 as Clock9Impl } from "./clock-9"

export default { title: "Icon/Clock 9", component: Clock9Impl }

export const Clock9 = (args: ComponentProps<typeof Clock9Impl>) => <Clock9Impl {...args} />
