import type { ComponentProps } from "react"
import type { StoryContext } from "@storybook/react"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { Accordion as AccordionImpl, AccordionItem, AccordionTrigger, AccordionPanel } from "./accordion"

export default {
  title: "Components/Layout/Accordion",
  component: AccordionImpl,
  args: { multiple: false, defaultValue: ["item-1"] },
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

Accordion.play = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement)

  await userEvent.click(canvas.getByRole("button", { name: "Another item" }))
  await waitFor(() => expect(canvas.getByText("More content revealed here.")).toBeVisible())
}
