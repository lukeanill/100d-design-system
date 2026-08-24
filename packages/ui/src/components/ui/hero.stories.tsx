import type { ComponentProps } from "react"
import { Hero as HeroImpl } from "./hero"

export default { title: "Components/Hero", component: HeroImpl }

export const Hero = (args: ComponentProps<typeof HeroImpl>) => <HeroImpl {...args} />
