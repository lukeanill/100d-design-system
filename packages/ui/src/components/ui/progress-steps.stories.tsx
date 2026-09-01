import type { ComponentProps } from "react"
import { ProgressSteps as ProgressStepsImpl, ProgressStepsList } from "./progress-steps"

export default {
  title: "Components/Feedback/Progress Steps",
  component: ProgressStepsImpl,
  argTypes: {
    "data.steps": { table: { disable: true } },
  },
  args: {
    data: {
      steps: [
        { label: "Cart", status: "completed" },
        { label: "Shipping", status: "current" },
        { label: "Payment", status: "pending" },
        { label: "Confirm", status: "pending" },
      ],
    },
  },
}

export const ProgressSteps = (args: ComponentProps<typeof ProgressStepsImpl>) => (
  <ProgressStepsImpl {...args}>
    <ProgressStepsList />
  </ProgressStepsImpl>
)
