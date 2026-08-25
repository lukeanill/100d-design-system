import type { ComponentProps } from "react"
import { AmountInput as AmountInputImpl, AmountInputDisplay } from "./amount-input"

export default { title: "Components/Amount Input", component: AmountInputImpl }

export const AmountInput = (args: ComponentProps<typeof AmountInputImpl>) => (
  <AmountInputImpl {...args}>
    <AmountInputDisplay />
  </AmountInputImpl>
)
