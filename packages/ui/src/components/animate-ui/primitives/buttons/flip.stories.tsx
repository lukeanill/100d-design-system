import type { ComponentProps } from "react"
import { FlipButton as FlipButtonImpl } from "./flip"

export default { title: "Animation/Flip Buttons", component: FlipButtonImpl }

export const FlipButtons = (args: ComponentProps<typeof FlipButtonImpl>) => <FlipButtonImpl {...args} />
