import type { ComponentProps } from "react"
import { Paperclip as PaperclipImpl } from "./paperclip"

export default {
  title: "Icon/Paperclip",
  component: PaperclipImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Paperclip = (args: ComponentProps<typeof PaperclipImpl>) => <PaperclipImpl {...args} />
