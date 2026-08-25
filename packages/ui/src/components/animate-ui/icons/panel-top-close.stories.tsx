import type { ComponentProps } from "react"
import { PanelTopClose as PanelTopCloseImpl } from "./panel-top-close"

export default {
  title: "Icon/Panel Top Close",
  component: PanelTopCloseImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const PanelTopClose = (args: ComponentProps<typeof PanelTopCloseImpl>) => <PanelTopCloseImpl {...args} />
