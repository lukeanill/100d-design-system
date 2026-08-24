import type { ComponentProps } from "react"
import { Frame as FrameImpl } from "./frame"

export default { title: "Icon/Frame", component: FrameImpl }

export const Frame = (args: ComponentProps<typeof FrameImpl>) => <FrameImpl {...args} />
