import type { ComponentProps } from "react"
import { AlertDialog as AlertDialogImpl } from "./alert-dialog"

export default { title: "Animation/Alert Dialog Base", component: AlertDialogImpl }

export const AlertDialogBase = (args: ComponentProps<typeof AlertDialogImpl>) => <AlertDialogImpl {...args} />
