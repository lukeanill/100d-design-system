import type { ComponentProps } from "react"
import { Settings as SettingsImpl } from "./settings"

export default {
  title: "Icon/Settings",
  component: SettingsImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Settings = (args: ComponentProps<typeof SettingsImpl>) => <SettingsImpl {...args} />
