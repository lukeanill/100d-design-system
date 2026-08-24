import type { ComponentProps } from "react"
import { Moon as MoonImpl } from "./moon"

export default { title: "Icon/Moon", component: MoonImpl }

export const Moon = (args: ComponentProps<typeof MoonImpl>) => <MoonImpl {...args} />
