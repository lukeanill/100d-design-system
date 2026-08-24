import type { ComponentProps } from "react"
import { BubbleBackground as BubbleBackgroundImpl } from "./bubble"

export default { title: "Components/Bubble Background", component: BubbleBackgroundImpl }

export const Bubble = (args: ComponentProps<typeof BubbleBackgroundImpl>) => <BubbleBackgroundImpl {...args} />
