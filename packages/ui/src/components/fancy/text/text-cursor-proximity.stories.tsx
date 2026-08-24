import type { ComponentProps } from "react"
import TextCursorProximityImpl from "./text-cursor-proximity"

export default { title: "Animation/Text Cursor Proximity", component: TextCursorProximityImpl }

export const TextCursorProximity = (args: ComponentProps<typeof TextCursorProximityImpl>) => <TextCursorProximityImpl {...args} />
