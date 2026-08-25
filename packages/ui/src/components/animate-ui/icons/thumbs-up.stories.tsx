import type { ComponentProps } from "react"
import { ThumbsUp as ThumbsUpImpl } from "./thumbs-up"

export default {
  title: "Icon/Thumbs Up",
  component: ThumbsUpImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const ThumbsUp = (args: ComponentProps<typeof ThumbsUpImpl>) => <ThumbsUpImpl {...args} />
