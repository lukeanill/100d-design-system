import type { ComponentProps } from "react"
import { EventList as EventListImpl, EventListContent } from "./event-list"

export default { title: "Components/Event List", component: EventListImpl }

export const EventList = (args: ComponentProps<typeof EventListImpl>) => (
  <EventListImpl {...args}>
    <EventListContent />
  </EventListImpl>
)
