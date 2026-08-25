import type { ComponentProps } from "react"
import { EvCharger as EvChargerImpl } from "./ev-charger"

export default {
  title: "Icon/Ev Charger",
  component: EvChargerImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const EvCharger = (args: ComponentProps<typeof EvChargerImpl>) => <EvChargerImpl {...args} />
