import type { ComponentProps } from "react"
import { Minimize as MinimizeImpl } from "./minimize"

export default { title: "Icon/Minimize", component: MinimizeImpl }

export const Minimize = (args: ComponentProps<typeof MinimizeImpl>) => <MinimizeImpl {...args} />
