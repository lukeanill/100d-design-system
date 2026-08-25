import type { ComponentProps } from "react"
import { CircleCheck as CircleCheckImpl } from "./circle-check"

export default {
  title: "Icon/Circle Check",
  component: CircleCheckImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const CircleCheck = (args: ComponentProps<typeof CircleCheckImpl>) => <CircleCheckImpl {...args} />
