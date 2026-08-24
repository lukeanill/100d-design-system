import type { ComponentProps } from "react"
import { Separator as SeparatorImpl } from "./separator"

export default { title: "Components/Separator", component: SeparatorImpl }

export const Separator = (args: ComponentProps<typeof SeparatorImpl>) => <SeparatorImpl {...args} />
