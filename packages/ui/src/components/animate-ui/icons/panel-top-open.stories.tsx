import type { ComponentProps } from "react"
import { PanelTopOpen as PanelTopOpenImpl } from "./panel-top-open"

export default {
  title: "Icon/Panel Top Open",
  component: PanelTopOpenImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const PanelTopOpen = (args: ComponentProps<typeof PanelTopOpenImpl>) => <PanelTopOpenImpl {...args} />
