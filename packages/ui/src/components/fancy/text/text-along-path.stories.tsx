import type { ComponentProps } from "react"
import AnimatedPathTextImpl from "./text-along-path"

export default {
  title: "Animation/Text Along Path",
  component: AnimatedPathTextImpl,
  args: {
    path: "M 10,90 Q 100,10 190,90",
    text: "Along the path we go",
    showPath: true,
  },
}

export const TextAlongPath = (args: ComponentProps<typeof AnimatedPathTextImpl>) => <AnimatedPathTextImpl {...args} />
