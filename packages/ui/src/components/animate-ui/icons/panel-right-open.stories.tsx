import type { ComponentProps } from "react"
import { PanelRightOpen as PanelRightOpenImpl } from "./panel-right-open"

export default {
  title: "Icon/Panel Right Open",
  component: PanelRightOpenImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const PanelRightOpen = (args: ComponentProps<typeof PanelRightOpenImpl>) => <PanelRightOpenImpl {...args} />
