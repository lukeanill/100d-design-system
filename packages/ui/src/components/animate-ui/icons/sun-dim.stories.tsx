import type { ComponentProps } from "react"
import { SunDim as SunDimImpl } from "./sun-dim"

export default { title: "Icon/Sun Dim", component: SunDimImpl }

export const SunDim = (args: ComponentProps<typeof SunDimImpl>) => <SunDimImpl {...args} />
