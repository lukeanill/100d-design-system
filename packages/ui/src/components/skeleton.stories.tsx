import type { ComponentProps } from "react"
import { Skeleton as SkeletonImpl } from "./skeleton"

export default { title: "Components/Feedback/Skeleton", component: SkeletonImpl }

export const Skeleton = (args: ComponentProps<typeof SkeletonImpl>) => (
  <SkeletonImpl {...args} className="h-12 w-48 rounded-lg" />
)
