import type { ComponentProps } from "react"
import { RadioTower as RadioTowerImpl } from "./radio-tower"

export default {
  title: "Icon/Radio Tower",
  component: RadioTowerImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const RadioTower = (args: ComponentProps<typeof RadioTowerImpl>) => <RadioTowerImpl {...args} />
