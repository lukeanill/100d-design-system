import type { ComponentProps } from "react"
import { Zoom as ZoomImpl } from "./zoom"

export default { title: "Animation/Zoom (Effects)", component: ZoomImpl }

export const Zoom = (args: ComponentProps<typeof ZoomImpl>) => <ZoomImpl {...args} />
