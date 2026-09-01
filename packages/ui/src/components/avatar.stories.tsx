import type { ComponentProps } from "react"
import { Avatar as AvatarImpl, AvatarImage, AvatarFallback } from "./avatar"

export default {
  title: "Components/Content/Avatar",
  component: AvatarImpl,
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm", "lg"],
    },
  },
  args: { size: "default" },
}

export const Avatar = (args: ComponentProps<typeof AvatarImpl>) => (
  <AvatarImpl {...args}>
    <AvatarImage src="https://github.com/shadcn.png" alt="User avatar" />
    <AvatarFallback>CN</AvatarFallback>
  </AvatarImpl>
)
