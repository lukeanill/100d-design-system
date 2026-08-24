import type { ComponentProps } from "react"
import { PhoneCall as PhoneCallImpl } from "./phone-call"

export default { title: "Icon/Phone Call", component: PhoneCallImpl }

export const PhoneCall = (args: ComponentProps<typeof PhoneCallImpl>) => <PhoneCallImpl {...args} />
