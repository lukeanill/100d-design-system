import type { ComponentProps } from "react"
import { Fade as FadeImpl } from "./fade"

export default { title: "Animation/Fade (Effects)", component: FadeImpl }

export const Fade = (args: ComponentProps<typeof FadeImpl>) => <FadeImpl {...args} />
