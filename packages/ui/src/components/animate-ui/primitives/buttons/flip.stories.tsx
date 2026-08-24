import type { ComponentProps } from "react"
import { FlipButton as FlipButtonImpl } from "./flip"

export default { title: "Animation/Flip (Buttons)", component: FlipButtonImpl }

export const Flip = (args: ComponentProps<typeof FlipButtonImpl>) => <FlipButtonImpl {...args} />
