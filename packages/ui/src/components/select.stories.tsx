import type { ComponentProps } from "react"
import { Select as SelectImpl } from "./select"

export default { title: "Components/Select", component: SelectImpl }

export const Select = (args: ComponentProps<typeof SelectImpl>) => <SelectImpl {...args} />
