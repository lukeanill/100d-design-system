import type { ComponentProps } from "react"
import { Alert as AlertImpl } from "./alert"

export default { title: "Components/Alert", component: AlertImpl }

export const Alert = (args: ComponentProps<typeof AlertImpl>) => <AlertImpl {...args} />
