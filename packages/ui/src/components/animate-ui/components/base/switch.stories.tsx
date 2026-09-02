import type { ComponentProps } from "react"
import { Switch as SwitchImpl } from "./switch"

export default {
  title: "Components/Selects/Switch",
  component: SwitchImpl,
  argTypes: {
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: { defaultChecked: true, disabled: false },
}

export const Switch = (args: ComponentProps<typeof SwitchImpl>) => <SwitchImpl {...args} />
