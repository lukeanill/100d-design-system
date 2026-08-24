import type { ComponentProps } from "react"
import { BetweenVerticalEnd as BetweenVerticalEndImpl } from "./between-vertical-end"

export default { title: "Icon/Between Vertical End", component: BetweenVerticalEndImpl }

export const BetweenVerticalEnd = (args: ComponentProps<typeof BetweenVerticalEndImpl>) => <BetweenVerticalEndImpl {...args} />
