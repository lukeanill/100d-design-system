import type { ComponentProps } from "react"
import { Plus as PlusImpl } from "./plus"

export default { title: "Icon/Plus", component: PlusImpl }

export const Plus = (args: ComponentProps<typeof PlusImpl>) => <PlusImpl {...args} />
