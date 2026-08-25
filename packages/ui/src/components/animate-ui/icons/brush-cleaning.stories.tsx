import type { ComponentProps } from "react"
import { BrushCleaning as BrushCleaningImpl } from "./brush-cleaning"

export default {
  title: "Icon/Brush Cleaning",
  component: BrushCleaningImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const BrushCleaning = (args: ComponentProps<typeof BrushCleaningImpl>) => <BrushCleaningImpl {...args} />
