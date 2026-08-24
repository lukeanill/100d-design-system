import type { ComponentProps } from "react"
import { Command as CommandImpl } from "./command"

export default { title: "Components/Command", component: CommandImpl }

export const Command = (args: ComponentProps<typeof CommandImpl>) => <CommandImpl {...args} />
