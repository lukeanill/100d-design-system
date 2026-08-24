import type { ComponentProps } from "react"
import { Toggle as ToggleImpl } from "./toggle"

export default { title: "Animation/Toggle Base", component: ToggleImpl }

export const ToggleBase = (args: ComponentProps<typeof ToggleImpl>) => <ToggleImpl {...args} />
