import type { ComponentProps } from "react"
import { Popover as PopoverImpl, PopoverTrigger, PopoverPanel, PopoverTitle, PopoverDescription } from "./popover"
import { Button } from "@workspace/ui/components/button"

export default { title: "Components/Popover", component: PopoverImpl }

export const Popover = (args: ComponentProps<typeof PopoverImpl>) => (
  <PopoverImpl {...args}>
    <PopoverTrigger render={<Button variant="outline">Open popover</Button>} />
    <PopoverPanel>
      <PopoverTitle>Popover title</PopoverTitle>
      <PopoverDescription>Some popover content goes here.</PopoverDescription>
    </PopoverPanel>
  </PopoverImpl>
)
