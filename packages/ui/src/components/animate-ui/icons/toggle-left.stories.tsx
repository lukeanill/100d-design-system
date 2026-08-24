import type { ComponentProps } from "react"
import { ToggleLeft as ToggleLeftImpl } from "./toggle-left"

export default { title: "Icon/Toggle Left", component: ToggleLeftImpl }

export const ToggleLeft = (args: ComponentProps<typeof ToggleLeftImpl>) => <ToggleLeftImpl {...args} />
