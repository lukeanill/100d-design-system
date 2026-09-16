import type { ComponentProps } from "react"
import type { StoryContext } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import { Switch as SwitchImpl } from "./switch"

export default {
  title: "Components/Selects/Switch",
  component: SwitchImpl,
  argTypes: {
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: { defaultChecked: true, disabled: false },
}

export const Switch = (args: ComponentProps<typeof SwitchImpl>) => <SwitchImpl aria-label="Enable notifications" {...args} />

Switch.play = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement)
  const toggle = canvas.getByRole("switch", { name: "Enable notifications" })

  await expect(toggle).toHaveAttribute("aria-checked", "true")
  await userEvent.click(toggle)
  await expect(toggle).toHaveAttribute("aria-checked", "false")
}
