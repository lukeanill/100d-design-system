import type { ComponentProps } from "react"
import {
  TicketTierSelect as TicketTierSelectImpl,
  TicketTierContent,
  TicketTierHeader,
  TicketTierOptions,
  TicketOrderSummary,
} from "./ticket-tier-select"

export default { title: "Components/Ticket Tier Select", component: TicketTierSelectImpl }

export const TicketTierSelect = (args: ComponentProps<typeof TicketTierSelectImpl>) => (
  <TicketTierSelectImpl {...args}>
    <TicketTierHeader />
    <TicketTierContent>
      <TicketTierOptions />
      <TicketOrderSummary />
    </TicketTierContent>
  </TicketTierSelectImpl>
)
