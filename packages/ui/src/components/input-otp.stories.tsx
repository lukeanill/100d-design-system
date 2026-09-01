import type { ComponentProps } from "react"
import { InputOTP as InputOTPImpl, InputOTPGroup, InputOTPSlot } from "./input-otp"

export default {
  title: "Components/Inputs/Input Otp",
  component: InputOTPImpl,
  argTypes: {
    textAlign: {
      control: "select",
      options: ["left", "center", "right"],
    },
    pushPasswordManagerStrategy: {
      control: "select",
      options: ["increase-width", "none"],
    },
  },
  args: { maxLength: 6, textAlign: "center" },
}

type Args = Omit<ComponentProps<typeof InputOTPImpl>, "children" | "render">

export const InputOtp = (args: Args) => (
  <InputOTPImpl {...args}>
    <InputOTPGroup>
      {Array.from({ length: 6 }).map((_, i) => (
        <InputOTPSlot key={i} index={i} />
      ))}
    </InputOTPGroup>
  </InputOTPImpl>
)
