import type { ComponentProps } from "react"
import { DateTimePicker as DateTimePickerImpl, DateTimePickerContent } from "./date-time-picker"

const today = new Date()
const availableDates = Array.from({ length: 14 }, (_, i) =>
  new Date(today.getFullYear(), today.getMonth(), today.getDate() + i)
).filter((date) => ![0, 6].includes(date.getDay()))

export default {
  title: "Components/Selects/Date Time Picker",
  component: DateTimePickerImpl,
  argTypes: {
    "appearance.showTitle": { control: "boolean" },
    "appearance.showTimezone": { control: "boolean" },
    "appearance.weekStartsOn": {
      control: "select",
      options: ["sunday", "monday", "saturday"],
    },
    "data.title": { control: "text" },
    "data.timezone": { control: "text" },
    "data.availableDates": { table: { disable: true } },
    "data.availableTimeSlots": { table: { disable: true } },
    actions: { table: { disable: true } },
    control: { table: { disable: true } },
  },
  args: {
    appearance: { showTimezone: true, showTitle: true, weekStartsOn: "sunday" },
    data: {
      availableDates,
      availableTimeSlots: ["9:00am", "10:00am", "11:30am", "1:00pm", "2:30pm", "4:00pm"],
      timezone: "Pacific Time - US & Canada",
      title: "Schedule your onboarding call",
    },
  },
}

export const DateTimePicker = (args: ComponentProps<typeof DateTimePickerImpl>) => (
  <DateTimePickerImpl {...args}>
    <DateTimePickerContent />
  </DateTimePickerImpl>
)
