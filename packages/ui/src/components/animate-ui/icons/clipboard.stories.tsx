import type { ComponentProps } from "react"
import { Clipboard as ClipboardImpl } from "./clipboard"

export default { title: "Icon/Clipboard", component: ClipboardImpl }

export const Clipboard = (args: ComponentProps<typeof ClipboardImpl>) => <ClipboardImpl {...args} />
