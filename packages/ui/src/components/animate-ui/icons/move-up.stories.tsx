import type { ComponentProps } from "react"
import { MoveUp as MoveUpImpl } from "./move-up"

export default { title: "Icon/Move Up", component: MoveUpImpl }

export const MoveUp = (args: ComponentProps<typeof MoveUpImpl>) => <MoveUpImpl {...args} />
