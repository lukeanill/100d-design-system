import type { ComponentProps } from "react"
import { Magnetic as MagneticImpl } from "./magnetic"

export default { title: "Animation/Magnetic Effects", component: MagneticImpl }

export const MagneticEffects = (args: ComponentProps<typeof MagneticImpl>) => <MagneticImpl {...args} />
