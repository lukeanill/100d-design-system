import type { ComponentProps } from "react"
import { BubbleBackgroundBrand as BubbleBackgroundBrandImpl } from "./bubble-brand"

export default {
  title: "Components/Bubble Brand",
  component: BubbleBackgroundBrandImpl,
  args: { interactive: true },
}

export const BubbleBrand = (args: ComponentProps<typeof BubbleBackgroundBrandImpl>) => (
  <div className="h-64 w-full">
    <BubbleBackgroundBrandImpl {...args} />
  </div>
)
