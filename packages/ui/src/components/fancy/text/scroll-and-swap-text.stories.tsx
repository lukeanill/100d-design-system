import type { ComponentProps } from "react"
import ScrollAndSwapTextImpl from "./scroll-and-swap-text"

export default { title: "Animation/Scroll And Swap Text", component: ScrollAndSwapTextImpl }

export const ScrollAndSwapText = (args: ComponentProps<typeof ScrollAndSwapTextImpl>) => <ScrollAndSwapTextImpl {...args} />
