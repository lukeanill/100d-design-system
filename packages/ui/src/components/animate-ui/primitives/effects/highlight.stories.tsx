import type { ComponentProps } from "react"
import { Highlight as HighlightImpl } from "./highlight"

export default { title: "Animation/Highlight (Effects)", component: HighlightImpl }

export const Highlight = (args: ComponentProps<typeof HighlightImpl>) => <HighlightImpl {...args} />
