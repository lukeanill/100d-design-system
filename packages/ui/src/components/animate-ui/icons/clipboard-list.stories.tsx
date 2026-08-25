import type { ComponentProps } from "react"
import { ClipboardList as ClipboardListImpl } from "./clipboard-list"

export default {
  title: "Icon/Clipboard List",
  component: ClipboardListImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const ClipboardList = (args: ComponentProps<typeof ClipboardListImpl>) => <ClipboardListImpl {...args} />
