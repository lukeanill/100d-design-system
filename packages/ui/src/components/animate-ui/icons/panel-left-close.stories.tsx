import type { ComponentProps } from "react"
import { PanelLeftClose as PanelLeftCloseImpl } from "./panel-left-close"

export default {
  title: "Icon/Panel Left Close",
  component: PanelLeftCloseImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const PanelLeftClose = (args: ComponentProps<typeof PanelLeftCloseImpl>) => <PanelLeftCloseImpl {...args} />
