import type { ComponentProps } from "react"
import { HoverCard as HoverCardImpl, HoverCardTrigger, HoverCardContent } from "./hover-card"

export default {
  title: "Components/Overlays/Hover Card",
  component: HoverCardImpl,
  argTypes: {
    defaultOpen: { control: "boolean" },
    onOpenChange: { table: { disable: true } },
    onOpenChangeComplete: { table: { disable: true } },
    actionsRef: { table: { disable: true } },
    handle: { table: { disable: true } },
    open: { table: { disable: true } },
    triggerId: { table: { disable: true } },
    defaultTriggerId: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  args: { defaultOpen: false },
}

export const HoverCard = (args: ComponentProps<typeof HoverCardImpl>) => (
  <HoverCardImpl {...args}>
    <HoverCardTrigger className="underline">@nextjs</HoverCardTrigger>
    <HoverCardContent>
      The React Framework – created and maintained by Vercel.
    </HoverCardContent>
  </HoverCardImpl>
)
