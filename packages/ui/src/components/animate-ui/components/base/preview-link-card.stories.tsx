import type { ComponentProps } from "react"
import { PreviewLinkCard as PreviewLinkCardImpl } from "./preview-link-card"

export default { title: "Components/Preview Link Card", component: PreviewLinkCardImpl }

export const PreviewLinkCard = (args: ComponentProps<typeof PreviewLinkCardImpl>) => <PreviewLinkCardImpl {...args} />
