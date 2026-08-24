import type { ComponentProps } from "react"
import { PaymentConfirmed as PaymentConfirmedImpl } from "./payment-confirmed"

export default { title: "Components/Payment Confirmed", component: PaymentConfirmedImpl }

export const PaymentConfirmed = (args: ComponentProps<typeof PaymentConfirmedImpl>) => <PaymentConfirmedImpl {...args} />
