import type { ComponentProps } from "react"
import { Paperclip as PaperclipImpl } from "./paperclip"

export default { title: "Icon/Paperclip", component: PaperclipImpl }

export const Paperclip = (args: ComponentProps<typeof PaperclipImpl>) => <PaperclipImpl {...args} />
