import type { ComponentProps } from "react"
import { PanelBottomOpen as PanelBottomOpenImpl } from "./panel-bottom-open"

export default {
  title: "Icon/Panel Bottom Open",
  component: PanelBottomOpenImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const PanelBottomOpen = (args: ComponentProps<typeof PanelBottomOpenImpl>) => <PanelBottomOpenImpl {...args} />
