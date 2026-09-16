import type { ComponentProps } from "react"
import type { StoryContext } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
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
    maxLength: { control: { type: "number", min: 1, max: 12 } },
    disabled: { control: "boolean" },
    onChange: { table: { disable: true } },
    onComplete: { table: { disable: true } },
  },
  args: { maxLength: 6, textAlign: "center", disabled: false },
}

type Args = Omit<ComponentProps<typeof InputOTPImpl>, "children" | "render">

export const InputOtp = (args: Args) => (
  <InputOTPImpl aria-label="One-time code" {...args}>
    <InputOTPGroup>
      {Array.from({ length: 6 }).map((_, i) => (
        <InputOTPSlot key={i} index={i} />
      ))}
    </InputOTPGroup>
  </InputOTPImpl>
)

InputOtp.play = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement)
  const input = canvas.getByRole("textbox", { name: "One-time code" })

  await userEvent.type(input, "123456")
  await expect(input).toHaveValue("123456")
  await expect(canvas.getByText("6")).toBeVisible()
}
