import type { ComponentProps } from "react"
import { PreviewCard as PreviewCardImpl, PreviewCardTrigger, PreviewCardPanel } from "./preview-card"

export default { title: "Components/Preview Card", component: PreviewCardImpl }

export const PreviewCard = (args: ComponentProps<typeof PreviewCardImpl>) => (
  <PreviewCardImpl {...args}>
    <PreviewCardTrigger href="#" className="underline">
      Hover for preview
    </PreviewCardTrigger>
    <PreviewCardPanel className="p-4">Preview content shown on hover.</PreviewCardPanel>
  </PreviewCardImpl>
)
