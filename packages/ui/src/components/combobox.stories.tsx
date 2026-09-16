import type { ComponentProps } from "react"
import type { StoryContext } from "@storybook/react"
import { expect, screen, userEvent, within } from "storybook/test"
import {
  Combobox as ComboboxImpl,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "./combobox"

export default {
  title: "Components/Selects/Combobox",
  component: ComboboxImpl,
  argTypes: {
    disabled: { control: "boolean" },
    multiple: { control: "boolean" },
    items: { control: "object" },
  },
  args: { items: ["Apple", "Banana", "Cherry"], disabled: false, multiple: false },
}

export const Combobox = (args: ComponentProps<typeof ComboboxImpl>) => (
  <ComboboxImpl {...args}>
    <ComboboxInput placeholder="Select a fruit..." />
    <ComboboxContent>
      <ComboboxList>
        {(item: string) => (
          <ComboboxItem key={item} value={item}>
            {item}
          </ComboboxItem>
        )}
      </ComboboxList>
    </ComboboxContent>
  </ComboboxImpl>
)

Combobox.play = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement)
  const input = canvas.getByPlaceholderText("Select a fruit...")

  await userEvent.type(input, "Ban")
  await userEvent.click(await screen.findByRole("option", { name: "Banana" }))
  await expect(input).toHaveValue("Banana")
}
