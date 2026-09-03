import type { ComponentProps } from "react"
import { Kbd as KbdImpl } from "./kbd"

export default {
  title: "Components/Actions/Kbd",
  component: KbdImpl,
  argTypes: {
    children: { control: "text" },
  },
  args: { children: "⌘K" },
}

export const Kbd = (args: ComponentProps<typeof KbdImpl>) => <KbdImpl {...args} />
