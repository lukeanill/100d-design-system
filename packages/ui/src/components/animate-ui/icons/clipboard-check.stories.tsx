import type { ComponentProps } from "react"
import { ClipboardCheck as ClipboardCheckImpl } from "./clipboard-check"

export default {
  title: "Icon/Clipboard Check",
  component: ClipboardCheckImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const ClipboardCheck = (args: ComponentProps<typeof ClipboardCheckImpl>) => <ClipboardCheckImpl {...args} />
