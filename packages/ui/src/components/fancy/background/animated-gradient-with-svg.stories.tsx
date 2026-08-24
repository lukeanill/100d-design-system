import type { ComponentProps } from "react"
import AnimatedGradientImpl from "./animated-gradient-with-svg"

export default { title: "Animation/Animated Gradient With Svg", component: AnimatedGradientImpl }

export const AnimatedGradientWithSvg = (args: ComponentProps<typeof AnimatedGradientImpl>) => <AnimatedGradientImpl {...args} />
