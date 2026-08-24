import type { ComponentProps } from "react"
import { ToggleGroup as ToggleGroupImpl } from "./toggle-group"

export default { title: "Components/Toggle Group", component: ToggleGroupImpl }

export const ToggleGroup = (args: ComponentProps<typeof ToggleGroupImpl>) => <ToggleGroupImpl {...args} />
