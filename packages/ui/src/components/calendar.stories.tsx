import type { ComponentProps } from "react"
import { Calendar as CalendarImpl } from "./calendar"

export default {
  title: "Components/Selects/Calendar",
  component: CalendarImpl,
  argTypes: {
    mode: {
      control: "select",
      options: ["single", "multiple", "range"],
    },
    captionLayout: {
      control: "select",
      options: ["label", "dropdown", "dropdown-months", "dropdown-years"],
    },
    buttonVariant: {
      control: "select",
      options: ["default", "outline", "secondary", "ghost", "destructive", "link"],
    },
    numberOfMonths: { control: { type: "number", min: 1, max: 3 } },
    showOutsideDays: { control: "boolean" },
    disabled: { control: "boolean" },
    selected: { table: { disable: true } },
    onSelect: { table: { disable: true } },
  },
  args: {
    mode: "single",
    captionLayout: "label",
    buttonVariant: "ghost",
    selected: new Date(2026, 8, 1),
    numberOfMonths: 1,
    showOutsideDays: true,
    disabled: false,
  },
}

export const Calendar = (args: ComponentProps<typeof CalendarImpl>) => <CalendarImpl {...args} />
