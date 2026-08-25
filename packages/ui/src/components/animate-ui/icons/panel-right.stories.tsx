import type { ComponentProps } from "react"
import { PanelRight as PanelRightImpl } from "./panel-right"

export default {
  title: "Icon/Panel Right",
  component: PanelRightImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const PanelRight = (args: ComponentProps<typeof PanelRightImpl>) => <PanelRightImpl {...args} />
