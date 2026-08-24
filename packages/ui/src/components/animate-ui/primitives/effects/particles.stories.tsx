import type { ComponentProps } from "react"
import { Particles as ParticlesImpl } from "./particles"

export default { title: "Animation/Particles (Effects)", component: ParticlesImpl }

export const Particles = (args: ComponentProps<typeof ParticlesImpl>) => <ParticlesImpl {...args} />
