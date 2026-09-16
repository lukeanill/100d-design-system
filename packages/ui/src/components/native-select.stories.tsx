import type { ComponentProps } from "react"
import type { StoryContext } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import { NativeSelect as NativeSelectImpl } from "./native-select"

export default {
  title: "Components/Selects/Native Select",
  component: NativeSelectImpl,
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm"],
    },
    disabled: { control: "boolean" },
    defaultValue: { control: "select", options: ["apple", "banana", "cherry"] },
  },
  args: { size: "default", defaultValue: "banana", disabled: false },
}

export const NativeSelect = (args: ComponentProps<typeof NativeSelectImpl>) => (
  <NativeSelectImpl aria-label="Fruit" {...args}>
    <option value="apple">Apple</option>
    <option value="banana">Banana</option>
    <option value="cherry">Cherry</option>
  </NativeSelectImpl>
)

NativeSelect.play = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement)
  const select = canvas.getByRole("combobox", { name: "Fruit" })

  await userEvent.selectOptions(select, "cherry")
  await expect(select).toHaveValue("cherry")
}
