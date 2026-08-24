import type { ComponentProps } from "react"
import { Tooltip as TooltipImpl } from "./tooltip"

export default { title: "Animation/Tooltip (Base)", component: TooltipImpl }

export const Tooltip = (args: ComponentProps<typeof TooltipImpl>) => <TooltipImpl {...args} />
