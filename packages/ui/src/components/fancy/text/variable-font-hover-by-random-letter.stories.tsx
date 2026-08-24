import type { ComponentProps } from "react"
import VariableFontHoverByRandomLetterImpl from "./variable-font-hover-by-random-letter"

export default { title: "Animation/Variable Font Hover By Random Letter", component: VariableFontHoverByRandomLetterImpl, args: { label: "Hover me", fromFontVariationSettings: "'wght' 400", toFontVariationSettings: "'wght' 900" } }

export const VariableFontHoverByRandomLetter = (args: ComponentProps<typeof VariableFontHoverByRandomLetterImpl>) => <VariableFontHoverByRandomLetterImpl {...args} />
