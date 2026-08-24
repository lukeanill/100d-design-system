import type { ComponentProps } from "react"
import { Bubble as BubbleImpl } from "./bubble"

export default { title: "Components/Bubble", component: BubbleImpl }

export const Bubble = (args: ComponentProps<typeof BubbleImpl>) => <BubbleImpl {...args} />
