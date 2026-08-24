import type { ComponentProps } from "react"
import { Blend as BlendImpl } from "./blend"

export default { title: "Icon/Blend", component: BlendImpl }

export const Blend = (args: ComponentProps<typeof BlendImpl>) => <BlendImpl {...args} />
