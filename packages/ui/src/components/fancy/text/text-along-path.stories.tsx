import type { ComponentProps } from "react"
import AnimatedPathTextImpl from "./text-along-path"

export default { title: "Animation/Text Along Path", component: AnimatedPathTextImpl }

export const TextAlongPath = (args: ComponentProps<typeof AnimatedPathTextImpl>) => <AnimatedPathTextImpl {...args} />
