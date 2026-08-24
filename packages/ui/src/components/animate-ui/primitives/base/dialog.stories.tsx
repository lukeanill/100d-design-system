import type { ComponentProps } from "react"
import { Dialog as DialogImpl } from "./dialog"

export default { title: "Animation/Dialog Base", component: DialogImpl }

export const DialogBase = (args: ComponentProps<typeof DialogImpl>) => <DialogImpl {...args} />
