import type { ComponentProps } from "react"
import { Orbit as OrbitImpl } from "./orbit"

export default { title: "Icon/Orbit", component: OrbitImpl }

export const Orbit = (args: ComponentProps<typeof OrbitImpl>) => <OrbitImpl {...args} />
