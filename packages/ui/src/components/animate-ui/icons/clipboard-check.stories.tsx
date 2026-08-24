import type { ComponentProps } from "react"
import { ClipboardCheck as ClipboardCheckImpl } from "./clipboard-check"

export default { title: "Icon/Clipboard Check", component: ClipboardCheckImpl }

export const ClipboardCheck = (args: ComponentProps<typeof ClipboardCheckImpl>) => <ClipboardCheckImpl {...args} />
