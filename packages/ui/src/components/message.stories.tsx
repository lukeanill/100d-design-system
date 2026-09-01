import type { ComponentProps } from "react"
import { Message as MessageImpl, MessageAvatar, MessageContent } from "./message"
import { Avatar, AvatarImage, AvatarFallback } from "@workspace/ui/components/avatar"

export default {
  title: "Components/Content/Message",
  component: MessageImpl,
  argTypes: { align: { control: "select", options: ["start", "end"] } },
  args: { align: "start" },
}

export const Message = (args: ComponentProps<typeof MessageImpl>) => (
  <MessageImpl {...args}>
    <MessageAvatar>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="User" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </MessageAvatar>
    <MessageContent>Hey, how's it going?</MessageContent>
  </MessageImpl>
)
