import type { ComponentProps } from "react"
import { Switch as SwitchImpl } from "./switch"

export default { title: "Components/Switch", component: SwitchImpl }

export const Switch = (args: ComponentProps<typeof SwitchImpl>) => <SwitchImpl {...args} />
