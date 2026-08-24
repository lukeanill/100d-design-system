import type { ComponentProps } from "react"
import { ArrowRight as ArrowRightImpl } from "./arrow-right"

export default { title: "Icon/Arrow Right", component: ArrowRightImpl }

export const ArrowRight = (args: ComponentProps<typeof ArrowRightImpl>) => <ArrowRightImpl {...args} />
