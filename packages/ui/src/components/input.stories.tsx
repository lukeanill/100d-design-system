import type { ComponentProps } from "react"
import { Input as InputImpl } from "./input"

export default {
  title: "Components/Input",
  component: InputImpl,
  args: { placeholder: "Email address", type: "email" },
}

export const Input = (args: ComponentProps<typeof InputImpl>) => <InputImpl {...args} />
