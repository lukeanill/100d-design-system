import type { ComponentProps } from "react"
import { Input as InputImpl } from "./input"

export default {
  title: "Components/Inputs/Input",
  component: InputImpl,
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url", "search", "date"],
    },
  },
  args: { placeholder: "Email address", type: "email" },
}

export const Input = (args: ComponentProps<typeof InputImpl>) => <InputImpl {...args} />
