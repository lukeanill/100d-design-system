import type { ComponentProps } from "react"
import ScrambleHoverImpl from "./scramble-hover"

export default { title: "Animation/Scramble Hover", component: ScrambleHoverImpl }

export const ScrambleHover = (args: ComponentProps<typeof ScrambleHoverImpl>) => <ScrambleHoverImpl {...args} />
