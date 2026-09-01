import type { ComponentProps } from "react"
import AnimatedGradientImpl from "./animated-gradient-with-svg"

export default {
  title: "Animation/Animated Gradient With Svg",
  tags: ["!dev"],
  component: AnimatedGradientImpl,
  argTypes: {
    speed: { control: { type: "range", min: 1, max: 15, step: 0.5 } },
    blur: { control: "select", options: ["light", "medium", "heavy"] },
  },
  args: { colors: ["#7FA4AC", "#BADBD6", "#CBE5DA"], speed: 5, blur: "light" },
}

export const AnimatedGradientWithSvg = (args: ComponentProps<typeof AnimatedGradientImpl>) => (
  <div style={{ position: "relative", height: 320, width: "100%" }}>
    <AnimatedGradientImpl {...args} />
  </div>
)
