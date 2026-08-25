import type { ComponentProps } from "react"
import {
  EventDetail as EventDetailImpl,
  EventDetailContent,
  EventDetailGallery,
  EventDetailHeader,
  EventDetailDescription,
  EventDetailTickets,
} from "./event-detail"

export default { title: "Components/Event Detail", component: EventDetailImpl }

export const EventDetail = (args: ComponentProps<typeof EventDetailImpl>) => (
  <EventDetailImpl {...args} className="max-w-2xl">
    <EventDetailContent>
      <EventDetailGallery />
      <EventDetailHeader />
      <EventDetailDescription />
      <EventDetailTickets />
    </EventDetailContent>
  </EventDetailImpl>
)
