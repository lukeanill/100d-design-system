import type { ComponentProps } from "react"
import { Spring as SpringImpl } from "./spring"

export default { title: "Animation/Spring Animate", component: SpringImpl }

export const SpringAnimate = (args: ComponentProps<typeof SpringImpl>) => <SpringImpl {...args} />
