import type { ComponentProps } from "react"
import { CheckLine as CheckLineImpl } from "./check-line"

export default { title: "Icon/Check Line", component: CheckLineImpl }

export const CheckLine = (args: ComponentProps<typeof CheckLineImpl>) => <CheckLineImpl {...args} />
