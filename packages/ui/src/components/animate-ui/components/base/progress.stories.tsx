import type { ComponentProps } from "react"
import { Progress as ProgressImpl, ProgressTrack, ProgressLabel, ProgressValue } from "./progress"

export default { title: "Components/Progress", component: ProgressImpl, args: { value: 60 } }

export const Progress = (args: ComponentProps<typeof ProgressImpl>) => (
  <ProgressImpl {...args} className="w-64">
    <ProgressLabel>Uploading</ProgressLabel>
    <ProgressTrack />
    <ProgressValue />
  </ProgressImpl>
)
