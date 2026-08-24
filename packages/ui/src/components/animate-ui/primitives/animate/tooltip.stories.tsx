import type { ComponentProps } from "react"
import { Tooltip as TooltipImpl } from "./tooltip"

export default { title: "Animation/Tooltip Animate", component: TooltipImpl }

export const TooltipAnimate = (args: ComponentProps<typeof TooltipImpl>) => <TooltipImpl {...args} />
