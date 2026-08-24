import type { ComponentProps } from "react"
import { MoveRight as MoveRightImpl } from "./move-right"

export default { title: "Icon/Move Right", component: MoveRightImpl }

export const MoveRight = (args: ComponentProps<typeof MoveRightImpl>) => <MoveRightImpl {...args} />
