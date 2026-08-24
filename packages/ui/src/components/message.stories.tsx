import type { ComponentProps } from "react"
import { Message as MessageImpl } from "./message"

export default { title: "Components/Message", component: MessageImpl }

export const Message = (args: ComponentProps<typeof MessageImpl>) => <MessageImpl {...args} />
