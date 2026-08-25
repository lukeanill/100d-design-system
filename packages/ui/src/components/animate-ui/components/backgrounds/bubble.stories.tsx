import type { ComponentProps } from "react"
import { BubbleBackground as BubbleBackgroundImpl } from "./bubble"

export default {
  title: "Components/Bubble Background",
  component: BubbleBackgroundImpl,
  args: { interactive: true },
}

export const BubbleBackground = (args: ComponentProps<typeof BubbleBackgroundImpl>) => (
  <div className="h-64 w-full">
    <BubbleBackgroundImpl {...args} />
  </div>
)
