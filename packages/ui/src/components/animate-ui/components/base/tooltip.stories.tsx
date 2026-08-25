import type { ComponentProps } from "react"
import { Tooltip as TooltipImpl, TooltipTrigger, TooltipPanel } from "./tooltip"
import { Button } from "@workspace/ui/components/button"

export default { title: "Components/Tooltip", component: TooltipImpl }

export const Tooltip = (args: ComponentProps<typeof TooltipImpl>) => (
  <TooltipImpl {...args}>
    <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
    <TooltipPanel>Tooltip content</TooltipPanel>
  </TooltipImpl>
)
