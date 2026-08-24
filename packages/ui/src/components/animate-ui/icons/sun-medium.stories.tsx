import type { ComponentProps } from "react"
import { SunMedium as SunMediumImpl } from "./sun-medium"

export default { title: "Icon/Sun Medium", component: SunMediumImpl }

export const SunMedium = (args: ComponentProps<typeof SunMediumImpl>) => <SunMediumImpl {...args} />
