import type { ComponentProps } from "react"
import type { StoryContext } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import { Checkbox as CheckboxImpl } from "./checkbox"

export default {
  title: "Components/Selects/Checkbox",
  component: CheckboxImpl,
  argTypes: {
    variant: { control: "select", options: ["default", "accent"] },
    size: { control: "select", options: ["default", "sm", "lg"] },
    disabled: { control: "boolean" },
    indeterminate: { control: "boolean" },
    defaultChecked: { control: "boolean" },
  },
  args: {
    variant: "default",
    size: "default",
    defaultChecked: true,
    disabled: false,
    indeterminate: false,
  },
}

export const Checkbox = (args: ComponentProps<typeof CheckboxImpl>) => <CheckboxImpl aria-label="Accept terms" {...args} />

Checkbox.play = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement)
  const checkbox = canvas.getByRole("checkbox", { name: "Accept terms" })

  await expect(checkbox).toHaveAttribute("aria-checked", "true")
  await userEvent.click(checkbox)
  await expect(checkbox).toHaveAttribute("aria-checked", "false")
}
