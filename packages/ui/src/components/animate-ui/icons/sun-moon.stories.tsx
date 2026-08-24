import type { ComponentProps } from "react"
import { SunMoon as SunMoonImpl } from "./sun-moon"

export default { title: "Icon/Sun Moon", component: SunMoonImpl }

export const SunMoon = (args: ComponentProps<typeof SunMoonImpl>) => <SunMoonImpl {...args} />
