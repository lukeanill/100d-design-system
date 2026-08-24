import type { ComponentProps } from "react"
import { Progress as ProgressImpl } from "./progress"

export default { title: "Components/Progress", component: ProgressImpl }

export const Progress = (args: ComponentProps<typeof ProgressImpl>) => <ProgressImpl {...args} />
