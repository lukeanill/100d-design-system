import type { ComponentProps } from "react"
import { Trash as TrashImpl } from "./trash"

export default { title: "Icon/Trash", component: TrashImpl }

export const Trash = (args: ComponentProps<typeof TrashImpl>) => <TrashImpl {...args} />
