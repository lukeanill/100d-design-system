import type { ComponentProps } from "react"
import type { StoryContext } from "@storybook/react"
import { expect, screen, userEvent, within } from "storybook/test"
import { Select as SelectImpl, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./select"

export default {
  title: "Components/Selects/Select",
  component: SelectImpl,
  argTypes: {
    disabled: { control: "boolean" },
    defaultValue: { control: "select", options: ["apple", "banana", "cherry", "date"] },
  },
  args: { defaultValue: "apple", disabled: false },
}

export const Select = (args: ComponentProps<typeof SelectImpl>) => (
  <SelectImpl {...args}>
    <SelectTrigger className="w-48" aria-label="Fruit">
      <SelectValue placeholder="Select a fruit" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
      <SelectItem value="cherry">Cherry</SelectItem>
      <SelectItem value="date" disabled>Date (out of stock)</SelectItem>
    </SelectContent>
  </SelectImpl>
)

Select.play = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement)
  const trigger = canvas.getByRole("combobox", { name: "Fruit" })

  await userEvent.click(trigger)
  await userEvent.click(await screen.findByRole("option", { name: "Banana" }))
  await expect(trigger).toHaveTextContent("Banana")
}
