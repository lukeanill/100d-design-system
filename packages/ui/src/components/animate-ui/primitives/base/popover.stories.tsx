import type { ComponentProps } from "react"
import { Popover as PopoverImpl } from "./popover"

export default { title: "Animation/Popover Base", component: PopoverImpl }

export const PopoverBase = (args: ComponentProps<typeof PopoverImpl>) => <PopoverImpl {...args} />
