import type { ComponentProps } from "react"
import { ToggleRight as ToggleRightImpl } from "./toggle-right"

export default { title: "Icon/Toggle Right", component: ToggleRightImpl }

export const ToggleRight = (args: ComponentProps<typeof ToggleRightImpl>) => <ToggleRightImpl {...args} />
