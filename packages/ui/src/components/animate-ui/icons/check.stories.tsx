import type { ComponentProps } from "react"
import { Check as CheckImpl } from "./check"

export default { title: "Icon/Check", component: CheckImpl }

export const Check = (args: ComponentProps<typeof CheckImpl>) => <CheckImpl {...args} />
