import type { ComponentProps } from "react"
import { Magnetic as MagneticImpl } from "./magnetic"

export default { title: "Animation/Magnetic (Effects)", component: MagneticImpl }

export const Magnetic = (args: ComponentProps<typeof MagneticImpl>) => <MagneticImpl {...args} />
