import type { ComponentProps } from "react"
import { ChatComposer as ChatComposerImpl } from "./chat-composer"

export default {
  title: "Components/AI/Chat",
  component: ChatComposerImpl,
  argTypes: {
    "labels.initialPrompt": { control: "text" },
    "labels.placeholder": { control: "text" },
    "data.messages": { table: { disable: true } },
    "data.suggestions": { table: { disable: true } },
    actions: { table: { disable: true } },
  },
  args: {
    labels: {
      initialPrompt: "Compare mint chip to last summer",
      placeholder: "Prompt or tag a flavor with @",
    },
  },
}

export const ChatComposer = (args: ComponentProps<typeof ChatComposerImpl>) => <ChatComposerImpl {...args} />
