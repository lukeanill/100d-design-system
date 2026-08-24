import type { ComponentProps } from "react"
import { Clock11 as Clock11Impl } from "./clock-11"

export default { title: "Icon/Clock 11", component: Clock11Impl }

export const Clock11 = (args: ComponentProps<typeof Clock11Impl>) => <Clock11Impl {...args} />
