import type { ComponentProps } from "react"
import {
  OrderConfirm as OrderConfirmImpl,
  OrderConfirmContent,
  OrderConfirmProduct,
  OrderConfirmDelivery,
  OrderConfirmFooter,
} from "./order-confirm"

export default { title: "Components/Order Confirm", component: OrderConfirmImpl }

export const OrderConfirm = (args: ComponentProps<typeof OrderConfirmImpl>) => (
  <OrderConfirmImpl {...args} className="max-w-sm">
    <OrderConfirmContent>
      <OrderConfirmProduct />
      <OrderConfirmDelivery />
      <OrderConfirmFooter />
    </OrderConfirmContent>
  </OrderConfirmImpl>
)
