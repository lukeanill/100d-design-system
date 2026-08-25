import type { ComponentProps } from "react"
import { PanelLeftOpen as PanelLeftOpenImpl } from "./panel-left-open"

export default {
  title: "Icon/Panel Left Open",
  component: PanelLeftOpenImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const PanelLeftOpen = (args: ComponentProps<typeof PanelLeftOpenImpl>) => <PanelLeftOpenImpl {...args} />
