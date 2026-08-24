import type { ComponentProps } from "react"
import { EvCharger as EvChargerImpl } from "./ev-charger"

export default { title: "Icon/Ev Charger", component: EvChargerImpl }

export const EvCharger = (args: ComponentProps<typeof EvChargerImpl>) => <EvChargerImpl {...args} />
