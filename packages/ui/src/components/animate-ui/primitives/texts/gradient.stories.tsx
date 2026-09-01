import type { ComponentProps } from "react"
import { GradientText as GradientTextImpl } from "./gradient"

export default {
  title: "Animation/Text/Loops/Gradient",
  component: GradientTextImpl,
  argTypes: {
    gradient: { control: "text" },
    neon: { control: "boolean" },
    transition: { control: false },
  },
  args: {
    text: "Gradient Text",
    gradient: "linear-gradient(90deg, #3b82f6 0%, #a855f7 20%, #ec4899 50%, #a855f7 80%, #3b82f6 100%)",
    neon: false,
  },
}

export const GradientTexts = (args: ComponentProps<typeof GradientTextImpl>) => <GradientTextImpl {...args} />
