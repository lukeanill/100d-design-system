import type { ComponentProps } from "react"
import { RollingText as RollingTextImpl } from "./rolling"

export default { title: "Animation/Rolling Texts", component: RollingTextImpl }

export const RollingTexts = (args: ComponentProps<typeof RollingTextImpl>) => <RollingTextImpl {...args} />
