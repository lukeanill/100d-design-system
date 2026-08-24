import type { ComponentProps } from "react"
import { Cross as CrossImpl } from "./cross"

export default { title: "Icon/Cross", component: CrossImpl }

export const Cross = (args: ComponentProps<typeof CrossImpl>) => <CrossImpl {...args} />
