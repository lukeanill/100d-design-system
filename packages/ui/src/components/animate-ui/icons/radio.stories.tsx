import type { ComponentProps } from "react"
import { Radio as RadioImpl } from "./radio"

export default {
  title: "Icon/Radio",
  component: RadioImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Radio = (args: ComponentProps<typeof RadioImpl>) => <RadioImpl {...args} />
