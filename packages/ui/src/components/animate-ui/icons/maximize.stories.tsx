import type { ComponentProps } from "react"
import { Maximize as MaximizeImpl } from "./maximize"

export default { title: "Icon/Maximize", component: MaximizeImpl }

export const Maximize = (args: ComponentProps<typeof MaximizeImpl>) => <MaximizeImpl {...args} />
