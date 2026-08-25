import type { ComponentProps } from "react"
import { InputOTP as InputOTPImpl, InputOTPGroup, InputOTPSlot } from "./input-otp"

export default { title: "Components/Input Otp", component: InputOTPImpl, args: { maxLength: 6 } }

export const InputOtp = (args: ComponentProps<typeof InputOTPImpl>) => (
  <InputOTPImpl {...args}>
    <InputOTPGroup>
      {Array.from({ length: 6 }).map((_, i) => (
        <InputOTPSlot key={i} index={i} />
      ))}
    </InputOTPGroup>
  </InputOTPImpl>
)
