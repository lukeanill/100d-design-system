import type { ComponentProps } from "react"
import VariableFontHoverByLetterImpl from "./variable-font-hover-by-letter"

export default { title: "Animation/Variable Font Hover By Letter", component: VariableFontHoverByLetterImpl, args: { label: "Hover me", fromFontVariationSettings: "'wght' 400", toFontVariationSettings: "'wght' 900" } }

export const VariableFontHoverByLetter = (args: ComponentProps<typeof VariableFontHoverByLetterImpl>) => <VariableFontHoverByLetterImpl {...args} />
