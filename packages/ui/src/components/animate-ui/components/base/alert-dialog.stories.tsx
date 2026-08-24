import type { ComponentProps } from "react"
import { AlertDialog as AlertDialogImpl } from "./alert-dialog"

export default { title: "Components/Alert Dialog", component: AlertDialogImpl }

export const AlertDialog = (args: ComponentProps<typeof AlertDialogImpl>) => <AlertDialogImpl {...args} />
