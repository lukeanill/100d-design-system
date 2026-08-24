import type { ComponentProps } from "react"
import { Terminal as TerminalImpl } from "./terminal"

export default { title: "Icon/Terminal", component: TerminalImpl }

export const Terminal = (args: ComponentProps<typeof TerminalImpl>) => <TerminalImpl {...args} />
