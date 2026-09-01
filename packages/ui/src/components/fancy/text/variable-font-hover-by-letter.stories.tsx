import type { ComponentProps } from "react"
import VariableFontHoverByLetterImpl from "./variable-font-hover-by-letter"

export default {
  title: "Animation/Text/Hover/Variable Font Hover By Letter",
  component: VariableFontHoverByLetterImpl,
  argTypes: {
    label: { control: "text" },
    fromFontVariationSettings: { control: "text" },
    toFontVariationSettings: { control: "text" },
    staggerFrom: { control: "select", options: ["first", "last", "center"] },
    staggerDuration: { control: { type: "range", min: 0, max: 0.2, step: 0.01 } },
  },
  args: {
    label: "Hover me",
    fromFontVariationSettings: "'wght' 400",
    toFontVariationSettings: "'wght' 900",
    staggerFrom: "first",
    staggerDuration: 0.03,
  },
}

export const VariableFontHoverByLetter = (args: ComponentProps<typeof VariableFontHoverByLetterImpl>) => <VariableFontHoverByLetterImpl {...args} />
