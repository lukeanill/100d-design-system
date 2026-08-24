import type { ComponentProps } from "react"
import { PreviewCard as PreviewCardImpl } from "./preview-card"

export default { title: "Animation/Preview Card Base", component: PreviewCardImpl }

export const PreviewCardBase = (args: ComponentProps<typeof PreviewCardImpl>) => <PreviewCardImpl {...args} />
