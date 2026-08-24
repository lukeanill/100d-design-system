import type { ComponentProps } from "react"
import { BubbleBackgroundBrand as BubbleBackgroundBrandImpl } from "./bubble-brand"

export default { title: "Components/Bubble Brand", component: BubbleBackgroundBrandImpl }

export const BubbleBrand = (args: ComponentProps<typeof BubbleBackgroundBrandImpl>) => <BubbleBackgroundBrandImpl {...args} />
