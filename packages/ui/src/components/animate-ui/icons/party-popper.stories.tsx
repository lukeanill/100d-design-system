import type { ComponentProps } from "react"
import { PartyPopper as PartyPopperImpl } from "./party-popper"

export default {
  title: "Icon/Party Popper",
  component: PartyPopperImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const PartyPopper = (args: ComponentProps<typeof PartyPopperImpl>) => <PartyPopperImpl {...args} />
