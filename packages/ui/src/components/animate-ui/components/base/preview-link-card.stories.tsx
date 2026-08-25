import type { ComponentProps } from "react"
import { PreviewLinkCard as PreviewLinkCardImpl, PreviewLinkCardTrigger, PreviewLinkCardPanel } from "./preview-link-card"

export default { title: "Components/Preview Link Card", component: PreviewLinkCardImpl }

export const PreviewLinkCard = (args: ComponentProps<typeof PreviewLinkCardImpl>) => (
  <PreviewLinkCardImpl {...args}>
    <PreviewLinkCardTrigger href="#" className="underline">
      example.com
    </PreviewLinkCardTrigger>
    <PreviewLinkCardPanel className="p-4">Link preview content.</PreviewLinkCardPanel>
  </PreviewLinkCardImpl>
)
