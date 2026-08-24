import type { ComponentProps } from "react"
import { ScissorsLineDashed as ScissorsLineDashedImpl } from "./scissors-line-dashed"

export default { title: "Icon/Scissors Line Dashed", component: ScissorsLineDashedImpl }

export const ScissorsLineDashed = (args: ComponentProps<typeof ScissorsLineDashedImpl>) => <ScissorsLineDashedImpl {...args} />
