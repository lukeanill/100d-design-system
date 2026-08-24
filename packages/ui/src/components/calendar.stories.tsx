import type { ComponentProps } from "react"
import { Calendar as CalendarImpl } from "./calendar"

export default { title: "Components/Calendar", component: CalendarImpl }

export const Calendar = (args: ComponentProps<typeof CalendarImpl>) => <CalendarImpl {...args} />
