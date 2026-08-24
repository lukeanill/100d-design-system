import type { ComponentProps } from "react"
import { Toggle as ToggleImpl } from "./toggle"

export default { title: "Components/Toggle", component: ToggleImpl }

export const Toggle = (args: ComponentProps<typeof ToggleImpl>) => <ToggleImpl {...args} />
