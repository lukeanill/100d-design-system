import type { ComponentProps } from "react"
import { Shrink as ShrinkImpl } from "./shrink"

export default { title: "Icon/Shrink", component: ShrinkImpl }

export const Shrink = (args: ComponentProps<typeof ShrinkImpl>) => <ShrinkImpl {...args} />
