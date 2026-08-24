import type { ComponentProps } from "react"
import { PartyPopper as PartyPopperImpl } from "./party-popper"

export default { title: "Icon/Party Popper", component: PartyPopperImpl }

export const PartyPopper = (args: ComponentProps<typeof PartyPopperImpl>) => <PartyPopperImpl {...args} />
