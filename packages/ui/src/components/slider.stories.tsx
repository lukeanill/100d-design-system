import type { ComponentProps } from "react"
import type { StoryContext } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import { Slider as SliderImpl } from "./slider"

export default {
  title: "Components/Selects/Slider",
  component: SliderImpl,
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    min: { control: { type: "number" } },
    max: { control: { type: "number" } },
    step: { control: { type: "number" } },
    disabled: { control: "boolean" },
    range: { control: "boolean" },
    defaultValue: { table: { disable: true } },
  },
  args: {
    defaultValue: [50],
    min: 0,
    max: 100,
    step: 1,
    orientation: "horizontal",
    disabled: false,
    range: false,
  },
}

export const Slider = ({ range, ...args }: ComponentProps<typeof SliderImpl> & { range?: boolean }) => (
  <SliderImpl
    key={range ? "range" : "single"}
    {...args}
    defaultValue={range ? [25, 75] : [50]}
    className="w-64"
    aria-label="Volume"
  />
)

Slider.play = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement)
  const slider = canvas.getByRole("slider", { name: "Volume" })

  await expect(slider).toHaveAttribute("aria-valuenow", "50")
  await userEvent.click(slider)
  await userEvent.keyboard("{ArrowRight}")
  await expect(slider).toHaveAttribute("aria-valuenow", "51")
}
