import type { ComponentProps } from "react"
import { Switch as SwitchImpl } from "./switch"

export default { title: "Animation/Switch (Base)", component: SwitchImpl }

export const Switch = (args: ComponentProps<typeof SwitchImpl>) => <SwitchImpl {...args} />
