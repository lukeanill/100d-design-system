import type { ComponentProps } from "react"
import { Toast as ToastImpl } from "./toast"

export default { title: "Components/Toast", component: ToastImpl }

export const Toast = (args: ComponentProps<typeof ToastImpl>) => <ToastImpl {...args} />
