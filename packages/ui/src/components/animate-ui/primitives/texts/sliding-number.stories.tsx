import type { ComponentProps } from "react"
import { SlidingNumber as SlidingNumberImpl } from "./sliding-number"

export default { title: "Animation/Sliding Number Texts", component: SlidingNumberImpl }

export const SlidingNumberTexts = (args: ComponentProps<typeof SlidingNumberImpl>) => <SlidingNumberImpl {...args} />
