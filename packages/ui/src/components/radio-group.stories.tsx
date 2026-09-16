import type { ComponentProps } from "react"
import type { StoryContext } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import { RadioGroup as RadioGroupImpl, RadioGroupItem } from "./radio-group"

export default {
  title: "Components/Selects/Radio Group",
  component: RadioGroupImpl,
  argTypes: {
    disabled: { control: "boolean" },
  },
  args: { defaultValue: "default", disabled: false },
}

export const RadioGroup = (args: ComponentProps<typeof RadioGroupImpl>) => (
  <RadioGroupImpl {...args}>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="default" id="r1" />
      <label htmlFor="r1" className="text-sm">Default</label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="comfortable" id="r2" />
      <label htmlFor="r2" className="text-sm">Comfortable</label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="disabled-option" id="r3" disabled />
      <label htmlFor="r3" className="text-sm">Disabled option</label>
    </div>
  </RadioGroupImpl>
)

RadioGroup.play = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement)
  const comfortable = canvas.getByRole("radio", { name: "Comfortable" })

  await userEvent.click(comfortable)
  await expect(comfortable).toHaveAttribute("aria-checked", "true")
  await expect(canvas.getByRole("radio", { name: "Default" })).toHaveAttribute("aria-checked", "false")
}
