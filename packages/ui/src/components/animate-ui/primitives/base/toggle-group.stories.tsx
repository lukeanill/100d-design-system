import type { ComponentProps } from "react"
import { ToggleGroup as ToggleGroupImpl } from "./toggle-group"

export default { title: "Animation/Toggle Group Base", component: ToggleGroupImpl }

export const ToggleGroupBase = (args: ComponentProps<typeof ToggleGroupImpl>) => <ToggleGroupImpl {...args} />
