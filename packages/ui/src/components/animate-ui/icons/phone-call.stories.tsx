import type { ComponentProps } from "react"
import { PhoneCall as PhoneCallImpl } from "./phone-call"

export default {
  title: "Icon/Phone Call",
  component: PhoneCallImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const PhoneCall = (args: ComponentProps<typeof PhoneCallImpl>) => <PhoneCallImpl {...args} />
