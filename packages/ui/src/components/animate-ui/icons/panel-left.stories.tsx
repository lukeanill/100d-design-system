import type { ComponentProps } from "react"
import { PanelLeft as PanelLeftImpl } from "./panel-left"

export default {
  title: "Icon/Panel Left",
  component: PanelLeftImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const PanelLeft = (args: ComponentProps<typeof PanelLeftImpl>) => <PanelLeftImpl {...args} />
