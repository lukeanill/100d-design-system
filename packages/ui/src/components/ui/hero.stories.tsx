import type { ComponentProps } from "react"
import { Hero as HeroImpl, HeroContent, HeroTitle, HeroDescription, HeroActions } from "./hero"

export default { title: "Components/Hero", component: HeroImpl }

export const Hero = (args: ComponentProps<typeof HeroImpl>) => (
  <HeroImpl {...args}>
    <HeroContent>
      <HeroTitle />
      <HeroDescription />
      <HeroActions />
    </HeroContent>
  </HeroImpl>
)
