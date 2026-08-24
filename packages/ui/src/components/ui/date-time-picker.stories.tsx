import type { ComponentProps } from "react"
import { DateTimePicker as DateTimePickerImpl } from "./date-time-picker"

export default { title: "Components/Date Time Picker", component: DateTimePickerImpl }

export const DateTimePicker = (args: ComponentProps<typeof DateTimePickerImpl>) => <DateTimePickerImpl {...args} />
