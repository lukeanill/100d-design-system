import type { ComponentProps } from "react"
import { Terminal as TerminalImpl } from "./terminal"

export default {
  title: "Icon/Terminal",
  component: TerminalImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Terminal = (args: ComponentProps<typeof TerminalImpl>) => <TerminalImpl {...args} />
