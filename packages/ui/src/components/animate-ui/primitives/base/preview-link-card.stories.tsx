import type { ComponentProps } from "react"
import { PreviewLinkCard as PreviewLinkCardImpl } from "./preview-link-card"

export default { title: "Animation/Preview Link Card Base", component: PreviewLinkCardImpl }

export const PreviewLinkCardBase = (args: ComponentProps<typeof PreviewLinkCardImpl>) => <PreviewLinkCardImpl {...args} />
