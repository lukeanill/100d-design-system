import type { ComponentProps } from "react"
import { MoveLeft as MoveLeftImpl } from "./move-left"

export default { title: "Icon/Move Left", component: MoveLeftImpl }

export const MoveLeft = (args: ComponentProps<typeof MoveLeftImpl>) => <MoveLeftImpl {...args} />
