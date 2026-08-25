import type { ComponentProps } from "react"
import BreathingTextImpl from "./breathing-text"

export default {
  title: "Animation/Breathing Text",
  component: BreathingTextImpl,
  args: {
    children: "Breathing Text",
    fromFontVariationSettings: "'wght' 400",
    toFontVariationSettings: "'wght' 900",
  },
}

export const BreathingText = (args: ComponentProps<typeof BreathingTextImpl>) => <BreathingTextImpl {...args} />
