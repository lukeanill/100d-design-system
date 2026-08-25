import type { ComponentProps } from "react"
import { Accordion as AccordionImpl, AccordionItem, AccordionTrigger, AccordionPanel } from "./accordion"

export default {
  title: "Components/Accordion",
  component: AccordionImpl,
  args: { type: "single", defaultValue: "item-1" },
}

export const Accordion = (args: ComponentProps<typeof AccordionImpl>) => (
  <AccordionImpl {...args}>
    <AccordionItem value="item-1">
      <AccordionTrigger>What is this?</AccordionTrigger>
      <AccordionPanel>An animated accordion component.</AccordionPanel>
    </AccordionItem>
    <AccordionItem value="item-2">
      <AccordionTrigger>Another item</AccordionTrigger>
      <AccordionPanel>More content revealed here.</AccordionPanel>
    </AccordionItem>
  </AccordionImpl>
)
