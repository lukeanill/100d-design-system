import type { ComponentProps } from "react"
import { RadioTower as RadioTowerImpl } from "./radio-tower"

export default { title: "Icon/Radio Tower", component: RadioTowerImpl }

export const RadioTower = (args: ComponentProps<typeof RadioTowerImpl>) => <RadioTowerImpl {...args} />
