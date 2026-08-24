import type { ComponentProps } from "react"
import { Sun as SunImpl } from "./sun"

export default { title: "Icon/Sun", component: SunImpl }

export const Sun = (args: ComponentProps<typeof SunImpl>) => <SunImpl {...args} />
