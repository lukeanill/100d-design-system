import type { ComponentProps } from "react"
import { Dialog as DialogImpl } from "./dialog"

export default { title: "Components/Dialog", component: DialogImpl }

export const Dialog = (args: ComponentProps<typeof DialogImpl>) => <DialogImpl {...args} />
