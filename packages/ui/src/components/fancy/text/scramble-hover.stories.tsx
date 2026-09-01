import type { ComponentProps } from "react"
import ScrambleHoverImpl from "./scramble-hover"

export default {
  title: "Animation/Text/Hover/Scramble Hover",
  component: ScrambleHoverImpl,
  argTypes: {
    revealDirection: { control: "select", options: ["start", "end", "center"] },
    scrambleSpeed: { control: { type: "range", min: 10, max: 200, step: 10 } },
    maxIterations: { control: { type: "range", min: 1, max: 30, step: 1 } },
    useOriginalCharsOnly: { control: "boolean" },
    sequential: { control: "boolean" },
    characters: { control: "text" },
  },
  args: {
    text: "Hover me",
    scrambleSpeed: 50,
    maxIterations: 10,
    sequential: false,
    revealDirection: "start",
    useOriginalCharsOnly: false,
  },
}

export const ScrambleHover = (args: ComponentProps<typeof ScrambleHoverImpl>) => <ScrambleHoverImpl {...args} />
