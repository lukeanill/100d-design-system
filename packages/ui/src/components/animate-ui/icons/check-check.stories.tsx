import type { ComponentProps } from "react"
import { CheckCheck as CheckCheckImpl } from "./check-check"

export default { title: "Icon/Check Check", component: CheckCheckImpl }

export const CheckCheck = (args: ComponentProps<typeof CheckCheckImpl>) => <CheckCheckImpl {...args} />
