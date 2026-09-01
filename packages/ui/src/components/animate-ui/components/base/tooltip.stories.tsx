import type { ComponentProps } from "react"
import { Tooltip as TooltipImpl, TooltipTrigger, TooltipPanel } from "./tooltip"
import { Button } from "@workspace/ui/components/button"

export default {
  title: "Components/Overlays/Tooltip",
  component: TooltipImpl,
  argTypes: {
    followCursor: { control: "select", options: [false, true, "x", "y"] },
  },
  args: { defaultOpen: false, delay: 0, followCursor: false },
}

export const Tooltip = (args: ComponentProps<typeof TooltipImpl>) => (
  <TooltipImpl {...args}>
    <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
    <TooltipPanel>Tooltip content</TooltipPanel>
  </TooltipImpl>
)
