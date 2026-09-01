import type { ComponentProps } from "react"
import { HoverCard as HoverCardImpl, HoverCardTrigger, HoverCardContent } from "./hover-card"

export default { title: "Components/Overlays/Hover Card", component: HoverCardImpl }

export const HoverCard = (args: ComponentProps<typeof HoverCardImpl>) => (
  <HoverCardImpl {...args}>
    <HoverCardTrigger className="underline">@nextjs</HoverCardTrigger>
    <HoverCardContent>
      The React Framework – created and maintained by Vercel.
    </HoverCardContent>
  </HoverCardImpl>
)
