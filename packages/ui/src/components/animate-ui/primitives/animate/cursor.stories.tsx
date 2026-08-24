import type { ComponentProps } from "react"
import { Cursor as CursorImpl } from "./cursor"

export default { title: "Animation/Cursor Animate", component: CursorImpl }

export const CursorAnimate = (args: ComponentProps<typeof CursorImpl>) => <CursorImpl {...args} />
