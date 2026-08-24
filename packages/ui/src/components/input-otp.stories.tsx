import type { ComponentProps } from "react"
import { InputOTP as InputOTPImpl } from "./input-otp"

export default { title: "Components/Input Otp", component: InputOTPImpl }

export const InputOtp = (args: ComponentProps<typeof InputOTPImpl>) => <InputOTPImpl {...args} />
