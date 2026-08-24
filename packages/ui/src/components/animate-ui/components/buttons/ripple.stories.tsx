import type { ComponentProps } from "react"
import { RippleButton as RippleButtonImpl } from "./ripple"

export default { title: "Components/Ripple", component: RippleButtonImpl }

export const Ripple = (args: ComponentProps<typeof RippleButtonImpl>) => <RippleButtonImpl {...args} />
