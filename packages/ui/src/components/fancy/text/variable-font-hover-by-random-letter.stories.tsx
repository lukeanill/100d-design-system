import type { ComponentProps } from "react"
import VariableFontHoverByRandomLetterImpl from "./variable-font-hover-by-random-letter"

export default {
  title: "Animation/Text/Hover/Variable Font Hover By Random Letter",
  component: VariableFontHoverByRandomLetterImpl,
  argTypes: {
    label: { control: "text" },
    fromFontVariationSettings: { control: "text" },
    toFontVariationSettings: { control: "text" },
    staggerDuration: { control: { type: "range", min: 0, max: 0.2, step: 0.01 } },
  },
  args: {
    label: "Hover me",
    fromFontVariationSettings: "'wght' 400",
    toFontVariationSettings: "'wght' 900",
    staggerDuration: 0.03,
  },
}

export const VariableFontHoverByRandomLetter = (args: ComponentProps<typeof VariableFontHoverByRandomLetterImpl>) => <VariableFontHoverByRandomLetterImpl {...args} />
