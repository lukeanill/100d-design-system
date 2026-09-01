import type { ComponentProps } from "react"
import BreathingTextImpl from "./breathing-text"

export default {
  title: "Animation/Text/Reveal/Breathing Text",
  component: BreathingTextImpl,
  argTypes: {
    fromFontVariationSettings: { control: "text" },
    toFontVariationSettings: { control: "text" },
    staggerFrom: { control: "select", options: ["first", "last", "center"] },
    staggerDuration: { control: { type: "range", min: 0, max: 0.5, step: 0.01 } },
    repeatDelay: { control: { type: "range", min: 0, max: 2, step: 0.1 } },
    transition: { control: false },
  },
  args: {
    children: "Breathing Text",
    fromFontVariationSettings: "'wght' 400",
    toFontVariationSettings: "'wght' 900",
    staggerFrom: "first",
    staggerDuration: 0.1,
    repeatDelay: 0.1,
  },
}

export const BreathingText = (args: ComponentProps<typeof BreathingTextImpl>) => <BreathingTextImpl {...args} />
