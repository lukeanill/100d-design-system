import type { ComponentProps } from "react"
import { RollingText as RollingTextImpl } from "./rolling"

export default { title: "Animation/Rolling Texts", component: RollingTextImpl, args: { text: "Rolling text" } }

export const RollingTexts = (args: ComponentProps<typeof RollingTextImpl>) => <RollingTextImpl {...args} />
