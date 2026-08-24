import type { ComponentProps } from "react"
import { ShimmeringText as ShimmeringTextImpl } from "./shimmering"

export default { title: "Animation/Shimmering Texts", component: ShimmeringTextImpl }

export const ShimmeringTexts = (args: ComponentProps<typeof ShimmeringTextImpl>) => <ShimmeringTextImpl {...args} />
