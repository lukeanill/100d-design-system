import type { ComponentProps } from "react"
import { Clock4 as Clock4Impl } from "./clock-4"

export default { title: "Icon/Clock 4", component: Clock4Impl }

export const Clock4 = (args: ComponentProps<typeof Clock4Impl>) => <Clock4Impl {...args} />
