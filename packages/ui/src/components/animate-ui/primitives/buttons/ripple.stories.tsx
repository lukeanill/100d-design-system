import type { ComponentProps } from "react"
import { RippleButton as RippleButtonImpl } from "./ripple"

export default { title: "Animation/Ripple (Buttons)", component: RippleButtonImpl }

export const Ripple = (args: ComponentProps<typeof RippleButtonImpl>) => <RippleButtonImpl {...args} />
