import type { ComponentProps } from "react"
import { Calendar as CalendarImpl } from "./calendar"

export default {
  title: "Components/Calendar",
  component: CalendarImpl,
  args: { mode: "single" },
}

export const Calendar = (args: ComponentProps<typeof CalendarImpl>) => <CalendarImpl {...args} />
