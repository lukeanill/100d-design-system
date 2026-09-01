import type { ComponentProps } from "react"
import { Separator as SeparatorImpl } from "./separator"

export default {
  title: "Components/Layout/Separator",
  component: SeparatorImpl,
  argTypes: { orientation: { control: "select", options: ["horizontal", "vertical"] } },
  args: { orientation: "horizontal" },
}

export const Separator = (args: ComponentProps<typeof SeparatorImpl>) => (
  <div className="w-64">
    <div className="text-sm">Above</div>
    <SeparatorImpl {...args} className="my-4" />
    <div className="text-sm">Below</div>
  </div>
)
