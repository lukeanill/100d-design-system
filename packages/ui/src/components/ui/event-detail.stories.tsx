import type { ComponentProps } from "react"
import { EventDetail as EventDetailImpl } from "./event-detail"

export default { title: "Components/Event Detail", component: EventDetailImpl }

export const EventDetail = (args: ComponentProps<typeof EventDetailImpl>) => <EventDetailImpl {...args} />
