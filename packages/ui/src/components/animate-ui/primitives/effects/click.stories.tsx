import type { ComponentProps } from "react"
import { Click as ClickImpl } from "./click"

export default { title: "Animation/Click (Effects)", component: ClickImpl }

export const Click = (args: ComponentProps<typeof ClickImpl>) => <ClickImpl {...args} />
