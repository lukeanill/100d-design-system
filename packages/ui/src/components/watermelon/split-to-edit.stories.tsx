import type { ComponentProps } from "react"
import { SplitToEdit as SplitToEditImpl } from "./split-to-edit"

export default {
  title: "Components/Inputs/Split To Edit",
  component: SplitToEditImpl,
  argTypes: {
    hours: { control: "number" },
    minutes: { control: "number" },
    maxHours: { control: "number" },
    hourLabel: { control: "text" },
    minuteLabel: { control: "text" },
    padHours: { control: "boolean" },
    disabled: { control: "boolean" },
    onSave: { control: false },
  },
  args: {
    hours: 1,
    minutes: 45,
    maxHours: 99,
    hourLabel: "Hr.",
    minuteLabel: "Min.",
    padHours: false,
    disabled: false,
  },
}

export const Duration = (args: ComponentProps<typeof SplitToEditImpl>) => (
  <SplitToEditImpl {...args} />
)

export const TimeOfDay = (args: ComponentProps<typeof SplitToEditImpl>) => (
  <SplitToEditImpl {...args} />
)
TimeOfDay.args = {
  hours: 9,
  minutes: 5,
  maxHours: 23,
  hourLabel: "h",
  minuteLabel: "min",
  padHours: true,
}
