import type { ComponentProps } from "react"
import { Sparkle as SparkleImpl } from "./sparkle"

export default {
  title: "Icon/Sparkle",
  component: SparkleImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Sparkle = (args: ComponentProps<typeof SparkleImpl>) => <SparkleImpl {...args} />
