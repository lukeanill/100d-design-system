import type { ComponentProps } from "react"
import { Sparkles as SparklesImpl } from "./sparkles"

export default {
  title: "Icon/Sparkles",
  component: SparklesImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Sparkles = (args: ComponentProps<typeof SparklesImpl>) => <SparklesImpl {...args} />
