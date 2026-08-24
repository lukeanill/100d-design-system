import type { ComponentProps } from "react"
import { EventCard as EventCardImpl } from "./event-card"

export default { title: "Components/Event Card", component: EventCardImpl }

export const EventCard = (args: ComponentProps<typeof EventCardImpl>) => <EventCardImpl {...args} />
