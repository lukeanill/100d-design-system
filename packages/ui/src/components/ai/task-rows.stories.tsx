import type { ComponentProps } from "react"
import { TaskRows as TaskRowsImpl } from "./task-rows"

export default {
  title: "Components/AI/Task Rows",
  component: TaskRowsImpl,
  argTypes: {
    "appearance.variant": { control: "select", options: ["Capsules", "List"] },
    "data.rows": { table: { disable: true } },
    actions: { table: { disable: true } },
  },
  args: {
    appearance: { variant: "Capsules" },
  },
}

export const TaskRows = (args: ComponentProps<typeof TaskRowsImpl>) => <TaskRowsImpl {...args} />
