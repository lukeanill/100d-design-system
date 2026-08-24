import type { ComponentProps } from "react"
import { ProgressSteps as ProgressStepsImpl } from "./progress-steps"

export default { title: "Components/Progress Steps", component: ProgressStepsImpl }

export const ProgressSteps = (args: ComponentProps<typeof ProgressStepsImpl>) => <ProgressStepsImpl {...args} />
