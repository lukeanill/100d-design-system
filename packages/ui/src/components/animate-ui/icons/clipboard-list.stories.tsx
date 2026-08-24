import type { ComponentProps } from "react"
import { ClipboardList as ClipboardListImpl } from "./clipboard-list"

export default { title: "Icon/Clipboard List", component: ClipboardListImpl }

export const ClipboardList = (args: ComponentProps<typeof ClipboardListImpl>) => <ClipboardListImpl {...args} />
