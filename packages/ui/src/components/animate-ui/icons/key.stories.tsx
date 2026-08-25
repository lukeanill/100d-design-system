import type { ComponentProps } from "react"
import { Key as KeyImpl } from "./key"

export default {
  title: "Icon/Key",
  component: KeyImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Key = (args: ComponentProps<typeof KeyImpl>) => <KeyImpl {...args} />
