import type { ComponentProps } from "react"
import { CircleCheckBig as CircleCheckBigImpl } from "./circle-check-big"

export default {
  title: "Icon/Circle Check Big",
  component: CircleCheckBigImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const CircleCheckBig = (args: ComponentProps<typeof CircleCheckBigImpl>) => <CircleCheckBigImpl {...args} />
