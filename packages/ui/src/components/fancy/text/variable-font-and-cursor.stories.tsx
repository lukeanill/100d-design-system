import type { ComponentProps } from "react"
import VariableFontAndCursorImpl from "./variable-font-and-cursor"

export default { title: "Animation/Variable Font And Cursor", component: VariableFontAndCursorImpl }

export const VariableFontAndCursor = (args: ComponentProps<typeof VariableFontAndCursorImpl>) => <VariableFontAndCursorImpl {...args} />
