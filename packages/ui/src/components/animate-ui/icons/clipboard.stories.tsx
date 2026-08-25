import type { ComponentProps } from "react"
import { Clipboard as ClipboardImpl } from "./clipboard"

export default {
  title: "Icon/Clipboard",
  component: ClipboardImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Clipboard = (args: ComponentProps<typeof ClipboardImpl>) => <ClipboardImpl {...args} />
