import type { ComponentProps } from "react"
import { ThumbsDown as ThumbsDownImpl } from "./thumbs-down"

export default {
  title: "Icon/Thumbs Down",
  component: ThumbsDownImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const ThumbsDown = (args: ComponentProps<typeof ThumbsDownImpl>) => <ThumbsDownImpl {...args} />
