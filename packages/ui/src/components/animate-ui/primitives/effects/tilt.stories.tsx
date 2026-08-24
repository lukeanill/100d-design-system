import type { ComponentProps } from "react"
import { Tilt as TiltImpl } from "./tilt"

export default { title: "Animation/Tilt Effects", component: TiltImpl }

export const TiltEffects = (args: ComponentProps<typeof TiltImpl>) => <TiltImpl {...args} />
