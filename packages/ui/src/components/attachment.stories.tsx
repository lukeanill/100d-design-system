import type { ComponentProps } from "react"
import {
  Attachment as AttachmentImpl,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
} from "./attachment"

export default {
  title: "Components/Attachment",
  component: AttachmentImpl,
  argTypes: {
    size: { control: "select", options: ["default", "sm", "xs"] },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
  args: { size: "default", orientation: "horizontal" },
}

export const Attachment = (args: ComponentProps<typeof AttachmentImpl>) => (
  <AttachmentImpl {...args}>
    <AttachmentMedia variant="icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      </svg>
    </AttachmentMedia>
    <AttachmentContent>
      <AttachmentTitle>document.pdf</AttachmentTitle>
      <AttachmentDescription>1.2 MB</AttachmentDescription>
    </AttachmentContent>
  </AttachmentImpl>
)
