import type { ComponentProps } from "react"
import { HoverCard as HoverCardImpl } from "./hover-card"

export default { title: "Components/Hover Card", component: HoverCardImpl }

export const HoverCard = (args: ComponentProps<typeof HoverCardImpl>) => <HoverCardImpl {...args} />
