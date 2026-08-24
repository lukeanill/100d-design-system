import type { ComponentProps } from "react"
import { Axis3D as Axis3DImpl } from "./axis-3d"

export default { title: "Icon/Axis 3d", component: Axis3DImpl }

export const Axis3d = (args: ComponentProps<typeof Axis3DImpl>) => <Axis3DImpl {...args} />
