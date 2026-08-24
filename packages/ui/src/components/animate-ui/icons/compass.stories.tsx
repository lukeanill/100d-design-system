import type { ComponentProps } from "react"
import { Compass as CompassImpl } from "./compass"

export default { title: "Icon/Compass", component: CompassImpl }

export const Compass = (args: ComponentProps<typeof CompassImpl>) => <CompassImpl {...args} />
