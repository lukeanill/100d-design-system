import type { ComponentProps } from "react"
import type { StoryContext } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import { Input as InputImpl } from "./input"

export default {
  title: "Components/Inputs/Input",
  component: InputImpl,
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url", "search", "date"],
    },
    disabled: { control: "boolean" },
    defaultValue: { control: "text" },
    onChange: { table: { disable: true } },
    onFocus: { table: { disable: true } },
    onBlur: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  args: { placeholder: "Email address", type: "email", disabled: false },
}

export const Input = (args: ComponentProps<typeof InputImpl>) => <InputImpl {...args} />

Input.play = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement)
  const input = canvas.getByPlaceholderText("Email address")

  await userEvent.type(input, "luke@example.com")
  await expect(input).toHaveValue("luke@example.com")
}
