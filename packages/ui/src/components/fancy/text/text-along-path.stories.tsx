import type { ComponentProps } from "react"
import AnimatedPathTextImpl from "./text-along-path"

export default {
  title: "Animation/Text/Loops/Text Along Path",
  component: AnimatedPathTextImpl,
  argTypes: {
    textAnchor: { control: "select", options: ["start", "middle", "end"] },
    animationType: { control: "select", options: ["auto", "scroll"] },
    duration: { control: { type: "range", min: 1, max: 10, step: 0.5 } },
    showPath: { control: "boolean" },
    viewBox: { control: "text" },
  },
  args: {
    path: "M 10,90 Q 100,10 190,90",
    text: "Along the path we go",
    showPath: true,
    textAnchor: "start",
    animationType: "auto",
    duration: 4,
    viewBox: "0 0 200 100",
  },
}

export const TextAlongPath = (args: ComponentProps<typeof AnimatedPathTextImpl>) => <AnimatedPathTextImpl {...args} />
