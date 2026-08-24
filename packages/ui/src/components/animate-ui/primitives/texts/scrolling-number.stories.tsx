import type { ComponentProps } from "react"
import { ScrollingNumber as ScrollingNumberImpl } from "./scrolling-number"

export default { title: "Animation/Scrolling Number Texts", component: ScrollingNumberImpl }

export const ScrollingNumberTexts = (args: ComponentProps<typeof ScrollingNumberImpl>) => <ScrollingNumberImpl {...args} />
