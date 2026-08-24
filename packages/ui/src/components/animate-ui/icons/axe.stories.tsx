import type { ComponentProps } from "react"
import { Axe as AxeImpl } from "./axe"

export default { title: "Icon/Axe", component: AxeImpl }

export const Axe = (args: ComponentProps<typeof AxeImpl>) => <AxeImpl {...args} />
