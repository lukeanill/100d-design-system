import type { ComponentProps } from "react"
import { BubbleBackground as BubbleBackgroundImpl, BRAND_BUBBLE_COLORS } from "./bubble"

export default {
  title: "Animation/Bubble Background",
  tags: ["!dev"],
  component: BubbleBackgroundImpl,
  argTypes: {
    transition: { table: { disable: true } },
    colors: { table: { disable: true } },
  },
  args: { interactive: true },
}

export const Default = (args: ComponentProps<typeof BubbleBackgroundImpl>) => (
  <div className="h-64 w-full">
    <BubbleBackgroundImpl {...args} />
  </div>
)

export const Brand = (args: ComponentProps<typeof BubbleBackgroundImpl>) => (
  <div className="h-64 w-full">
    <BubbleBackgroundImpl colors={BRAND_BUBBLE_COLORS} {...args} />
  </div>
)
