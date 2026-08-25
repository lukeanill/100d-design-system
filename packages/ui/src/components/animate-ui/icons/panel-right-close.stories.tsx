import type { ComponentProps } from "react"
import { PanelRightClose as PanelRightCloseImpl } from "./panel-right-close"

export default {
  title: "Icon/Panel Right Close",
  component: PanelRightCloseImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const PanelRightClose = (args: ComponentProps<typeof PanelRightCloseImpl>) => <PanelRightCloseImpl {...args} />
