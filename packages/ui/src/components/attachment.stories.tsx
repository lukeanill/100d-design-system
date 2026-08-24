import type { ComponentProps } from "react"
import { Attachment as AttachmentImpl } from "./attachment"

export default { title: "Components/Attachment", component: AttachmentImpl }

export const Attachment = (args: ComponentProps<typeof AttachmentImpl>) => <AttachmentImpl {...args} />
