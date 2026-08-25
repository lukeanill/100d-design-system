import type { ComponentProps } from "react"
import { EventConfirmation as EventConfirmationImpl, EventConfirmationContent } from "./event-confirmation"

export default { title: "Components/Event Confirmation", component: EventConfirmationImpl }

export const EventConfirmation = (args: ComponentProps<typeof EventConfirmationImpl>) => (
  <EventConfirmationImpl {...args}>
    <EventConfirmationContent />
  </EventConfirmationImpl>
)
