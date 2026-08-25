import type { ComponentProps } from "react"
import { ScissorsLineDashed as ScissorsLineDashedImpl } from "./scissors-line-dashed"

export default {
  title: "Icon/Scissors Line Dashed",
  component: ScissorsLineDashedImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const ScissorsLineDashed = (args: ComponentProps<typeof ScissorsLineDashedImpl>) => <ScissorsLineDashedImpl {...args} />
