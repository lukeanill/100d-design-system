import type { ComponentProps } from "react"
import { Clock7 as Clock7Impl } from "./clock-7"

export default { title: "Icon/Clock 7", component: Clock7Impl }

export const Clock7 = (args: ComponentProps<typeof Clock7Impl>) => <Clock7Impl {...args} />
