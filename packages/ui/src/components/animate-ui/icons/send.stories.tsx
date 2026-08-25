import type { ComponentProps } from "react"
import { Send as SendImpl } from "./send"

export default {
  title: "Icon/Send",
  component: SendImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Send = (args: ComponentProps<typeof SendImpl>) => <SendImpl {...args} />
