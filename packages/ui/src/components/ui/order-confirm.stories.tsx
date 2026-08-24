import type { ComponentProps } from "react"
import { OrderConfirm as OrderConfirmImpl } from "./order-confirm"

export default { title: "Components/Order Confirm", component: OrderConfirmImpl }

export const OrderConfirm = (args: ComponentProps<typeof OrderConfirmImpl>) => <OrderConfirmImpl {...args} />
