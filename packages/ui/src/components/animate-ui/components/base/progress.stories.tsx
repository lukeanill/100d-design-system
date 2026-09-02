import type { ComponentProps } from "react"
import { Progress as ProgressImpl, ProgressTrack, ProgressLabel, ProgressValue } from "./progress"

export default {
  title: "Components/Feedback/Progress",
  component: ProgressImpl,
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    min: { control: { type: "number" } },
    max: { control: { type: "number" } },
  },
  args: { value: 60, min: 0, max: 100 },
}

export const Progress = (args: ComponentProps<typeof ProgressImpl>) => (
  <ProgressImpl {...args} className="w-64">
    <ProgressLabel>Uploading</ProgressLabel>
    <ProgressTrack />
    <ProgressValue />
  </ProgressImpl>
)
