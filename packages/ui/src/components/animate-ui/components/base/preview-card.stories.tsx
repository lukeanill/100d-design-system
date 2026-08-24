import type { ComponentProps } from "react"
import { PreviewCard as PreviewCardImpl } from "./preview-card"

export default { title: "Components/Preview Card", component: PreviewCardImpl }

export const PreviewCard = (args: ComponentProps<typeof PreviewCardImpl>) => <PreviewCardImpl {...args} />
