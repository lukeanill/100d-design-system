import type { ComponentProps } from "react"
import { MoveDown as MoveDownImpl } from "./move-down"

export default { title: "Icon/Move Down", component: MoveDownImpl }

export const MoveDown = (args: ComponentProps<typeof MoveDownImpl>) => <MoveDownImpl {...args} />
