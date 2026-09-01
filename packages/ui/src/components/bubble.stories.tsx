import type { ComponentProps } from "react"
import { Bubble as BubbleImpl, BubbleContent } from "./bubble"

export default {
  title: "Components/Content/Bubble",
  component: BubbleImpl,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "muted", "tinted", "outline", "ghost", "destructive"],
    },
  },
  args: { variant: "default" },
}

export const Bubble = (args: ComponentProps<typeof BubbleImpl>) => (
  <BubbleImpl {...args}>
    <BubbleContent>Hello, how can I help you today?</BubbleContent>
  </BubbleImpl>
)
