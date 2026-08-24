import type { ComponentProps } from "react"
import { Popover as PopoverImpl } from "./popover"

export default { title: "Animation/Popover (Headless)", component: PopoverImpl }

export const Popover = (args: ComponentProps<typeof PopoverImpl>) => <PopoverImpl {...args} />
