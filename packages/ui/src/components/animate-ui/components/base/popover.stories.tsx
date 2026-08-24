import type { ComponentProps } from "react"
import { Popover as PopoverImpl } from "./popover"

export default { title: "Components/Popover", component: PopoverImpl }

export const Popover = (args: ComponentProps<typeof PopoverImpl>) => <PopoverImpl {...args} />
