import type { ComponentProps } from "react"
import { EventConfirmation as EventConfirmationImpl } from "./event-confirmation"

export default { title: "Components/Event Confirmation", component: EventConfirmationImpl }

export const EventConfirmation = (args: ComponentProps<typeof EventConfirmationImpl>) => <EventConfirmationImpl {...args} />
