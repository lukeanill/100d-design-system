import type { ComponentProps } from "react"
import { Settings as SettingsImpl } from "./settings"

export default { title: "Icon/Settings", component: SettingsImpl }

export const Settings = (args: ComponentProps<typeof SettingsImpl>) => <SettingsImpl {...args} />
