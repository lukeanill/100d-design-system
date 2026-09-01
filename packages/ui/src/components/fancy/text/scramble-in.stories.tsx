import type { ComponentProps } from "react"
import ScrambleInImpl from "./scramble-in"

export default {
  title: "Animation/Text/Reveal/Scramble In",
  component: ScrambleInImpl,
  argTypes: {
    scrambleSpeed: { control: { type: "range", min: 10, max: 200, step: 10 } },
    scrambledLetterCount: { control: { type: "range", min: 1, max: 10, step: 1 } },
    characters: { control: "text" },
    autoStart: { control: "boolean" },
  },
  args: { text: "Scramble in effect", scrambleSpeed: 50, scrambledLetterCount: 2, autoStart: true },
}

export const ScrambleIn = (args: ComponentProps<typeof ScrambleInImpl>) => <ScrambleInImpl {...args} />
