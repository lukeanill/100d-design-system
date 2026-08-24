import type { ComponentProps } from "react"
import AnimatedGradientImpl from "./animated-gradient-with-svg"

export default { title: "Animation/Animated Gradient With Svg", component: AnimatedGradientImpl, args: { colors: ["#7FA4AC", "#BADBD6", "#CBE5DA"] } }

export const AnimatedGradientWithSvg = (args: ComponentProps<typeof AnimatedGradientImpl>) => <AnimatedGradientImpl {...args} />
