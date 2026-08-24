import type { ComponentProps } from "react"
import { BrushCleaning as BrushCleaningImpl } from "./brush-cleaning"

export default { title: "Icon/Brush Cleaning", component: BrushCleaningImpl }

export const BrushCleaning = (args: ComponentProps<typeof BrushCleaningImpl>) => <BrushCleaningImpl {...args} />
